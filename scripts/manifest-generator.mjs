import { Jsonnet } from '@hanazuki/node-jsonnet';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestDirectory = path.join(root, 'conf', 'manifests');
const manifestFiles = {
  chromium: 'chromium.jsonnet',
  edge: 'edge.jsonnet',
  firefox: 'firefox.jsonnet',
};

function getGeckoExtensionId() {
  const extensionId = process.env.GECKO_EXTENSION_ID?.trim() || 'github-icons@example.org';
  if (!/^[A-Za-z0-9._-]{1,80}@[A-Za-z0-9._-]+$/.test(extensionId)) {
    throw new Error(`Invalid GECKO_EXTENSION_ID: ${extensionId}`);
  }
  return extensionId;
}

export async function generateManifest(target, outputDirectory) {
  const manifestFile = manifestFiles[target];
  if (!manifestFile) {
    throw new Error(`Unsupported browser target for manifest generation: ${target}`);
  }

  const geckoExtensionId = target === 'firefox' ? getGeckoExtensionId() : null;
  const jsonnet = new Jsonnet().addJpath(manifestDirectory).trailingNewline(true);
  if (geckoExtensionId) {
    jsonnet.extString('gecko_extension_id', geckoExtensionId);
  }

  let manifestText;
  try {
    manifestText = await jsonnet.evaluateFile(path.join(manifestDirectory, manifestFile));
  } catch (error) {
    throw new Error(`Failed to evaluate ${manifestFile}: ${error.message}`, { cause: error });
  }

  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch (error) {
    throw new Error(`Jsonnet produced invalid JSON for ${target}: ${error.message}`, { cause: error });
  }

  if (manifest.manifest_version !== 3) {
    throw new Error(`${manifestFile} must produce a Manifest V3 manifest`);
  }

  await mkdir(outputDirectory, { recursive: true });
  await writeFile(path.join(outputDirectory, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}
