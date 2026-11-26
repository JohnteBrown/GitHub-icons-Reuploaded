import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { awkjs } = require('awkjs');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestDirectory = path.join(root, 'conf', 'manifests');

const awkFiles = {
  chromium: 'chromium.awk',
  edge: 'edge.awk',
  firefox: 'firefox.awk',
};

export async function transformSource(source, target, filename) {
  const awkFile = awkFiles[target];
  if (!awkFile) {
    throw new Error(`Unsupported browser target for AWK transformation: ${target}`);
  }

  const [runtime, program] = await Promise.all([
    awkjs(),
    readFile(path.join(manifestDirectory, awkFile), 'utf8'),
  ]);
  const result = runtime.awk(source, program, []);
  if (result.stderr.trim()) {
    throw new Error(`AWK transformation failed for ${filename}: ${result.stderr.trim()}`);
  }

  return result.stdout;
}
