import { cp, mkdir, readFile, readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import buildModule from './build.cjs';
import { generateManifest } from './manifest-generator.mjs';
import { transformSource } from './source-transformer.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = path.join(root, 'dist');
const { buildBundles } = buildModule;
const targets = {
  chromium: 'Chromium',
  edge: 'Edge',
  firefox: 'Firefox',
};
const staticFiles = [
  'popup.html',
  'popup.css',
  'content.css',
  'spectre.min.css',
  'icon16.png',
  'icon48.png',
  'icon128.png',
];
const staticDirectories = ['icons', 'favicons', 'images'];

async function assertFileExists(directory, filename) {
  const filePath = path.join(directory, filename);
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile() || fileStat.size === 0) {
      throw new Error(`Required extension file is missing or empty: ${filename}`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Manifest references missing file: ${filename}`, { cause: error });
    }
    throw error;
  }
}

async function assertResourcePattern(directory, pattern) {
  if (!pattern.includes('*')) {
    await assertFileExists(directory, pattern);
    return;
  }

  const [relativeDirectory, filenamePattern] = pattern.split('/');
  const extension = filenamePattern.startsWith('*.') ? filenamePattern.slice(1) : null;
  if (!extension) {
    throw new Error(`Unsupported web-accessible resource pattern: ${pattern}`);
  }

  const entries = await readdir(path.join(directory, relativeDirectory));
  if (!entries.some((entry) => entry.endsWith(extension))) {
    throw new Error(`Manifest resource pattern has no matching files: ${pattern}`);
  }
}

async function validateDistribution(target, directory, manifest) {
  const paths = [
    ...Object.values(manifest.icons),
    ...Object.values(manifest.action.default_icon),
    manifest.action.default_popup,
    ...manifest.content_scripts.flatMap((script) => [...script.css, ...script.js]),
  ];

  if (target === 'firefox') {
    if (manifest.background.service_worker || !manifest.background.scripts?.includes('background.js')) {
      throw new Error('Firefox manifest must use background.scripts and must not use a service worker');
    }
    if (manifest.browser_specific_settings?.gecko?.id !== (
      process.env.GECKO_EXTENSION_ID?.trim() || 'github-icons@example.org'
    )) {
      throw new Error('Firefox manifest does not contain the configured Gecko extension ID');
    }
    if (JSON.stringify(manifest.browser_specific_settings.gecko.data_collection_permissions)
      !== JSON.stringify({ required: ['none'] })) {
      throw new Error('Firefox manifest must declare required data collection as none');
    }
    paths.push(...manifest.background.scripts);
  } else {
    if (manifest.background.service_worker !== 'background.js' || manifest.background.scripts) {
      throw new Error(`${targets[target]} manifest must use only the background service worker`);
    }
    paths.push(manifest.background.service_worker);
  }

  for (const file of paths) {
    await assertFileExists(directory, file);
  }

  for (const resource of manifest.web_accessible_resources.flatMap((entry) => entry.resources)) {
    await assertResourcePattern(directory, resource);
  }
}

async function copyStaticAssets(directory) {
  for (const file of staticFiles) {
    await cp(path.join(root, file), path.join(directory, file));
  }
  for (const assetDirectory of staticDirectories) {
    await cp(path.join(root, assetDirectory), path.join(directory, assetDirectory), { recursive: true });
  }
}

async function buildTarget(target) {
  const browserName = targets[target];
  if (!browserName) {
    throw new Error(`Unknown browser target "${target}". Choose chromium, edge, firefox, or all.`);
  }

  await mkdir(distDirectory, { recursive: true });
  const stagingDirectory = path.join(distDirectory, `.staging-${target}-${process.pid}`);
  const outputDirectory = path.join(distDirectory, browserName);
  await rm(stagingDirectory, { recursive: true, force: true });
  await mkdir(stagingDirectory, { recursive: true });

  try {
    await buildBundles(
      stagingDirectory,
      (source, filename) => transformSource(source, target, filename),
    );
    await generateManifest(target, stagingDirectory);
    await copyStaticAssets(stagingDirectory);
    const manifest = JSON.parse(await readFile(path.join(stagingDirectory, 'manifest.json'), 'utf8'));
    await validateDistribution(target, stagingDirectory, manifest);

    await rm(outputDirectory, { recursive: true, force: true });
    await rename(stagingDirectory, outputDirectory);
  } catch (error) {
    await rm(stagingDirectory, { recursive: true, force: true });
    throw new Error(`${browserName} build failed: ${error.message}`, { cause: error });
  }
}

try {
  const selectedTarget = process.argv[2];
  if (selectedTarget === 'all') {
    for (const target of Object.keys(targets)) {
      await buildTarget(target);
    }
  } else {
    await buildTarget(selectedTarget);
  }
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
