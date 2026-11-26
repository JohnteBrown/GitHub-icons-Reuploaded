'use strict';

const fs = require('fs');
const path = require('path');
const swc = require('@swc/core');

const root = path.resolve(__dirname, '..');
const swcConfig = JSON.parse(fs.readFileSync(path.join(root, '.swcrc'), 'utf8'));
delete swcConfig.$schema;

const entries = {
  background: path.join(root, 'src/packages/background/Background.ts'),
  content: path.join(root, 'src/packages/content/Content.ts'),
  popup: path.join(root, 'src/packages/popup/Popup.tsx'),
};

function resolveModule(specifier, importer) {
  if (specifier.startsWith('.')) {
    const base = path.resolve(path.dirname(importer), specifier);
    const candidates = [
      base,
      `${base}.js`,
      `${base}.ts`,
      `${base}.tsx`,
      `${base}.json`,
      path.join(base, 'index.js'),
      path.join(base, 'index.json'),
    ];
    const resolved = candidates.find((candidate) => fs.existsSync(candidate));
    if (resolved) {
      return resolved;
    }
  }

  try {
    return require.resolve(specifier, { paths: [path.dirname(importer)] });
  } catch (error) {
    throw new Error(`Cannot resolve "${specifier}" from ${importer}`, { cause: error });
  }
}

async function transformModule(file, preprocessSource) {
  if (file.endsWith('.json')) {
    return `module.exports = ${JSON.stringify(JSON.parse(fs.readFileSync(file, 'utf8')))};`;
  }

  let source = fs.readFileSync(file, 'utf8');
  if (preprocessSource && path.relative(path.join(root, 'src'), file).split(path.sep)[0] !== '..') {
    source = await preprocessSource(source, file);
  }

  const extension = path.extname(file);
  const options = structuredClone(swcConfig);
  options.jsc.parser = {
    ...options.jsc.parser,
    syntax: extension === '.ts' || extension === '.tsx' ? 'typescript' : 'ecmascript',
    tsx: extension === '.tsx',
  };
  options.filename = file;

  const result = await swc.transform(source, options);
  return result.code;
}

async function registerModule(file, state, preprocessSource) {
  const absoluteFile = path.resolve(file);
  if (state.moduleIds.has(absoluteFile)) {
    return state.moduleIds.get(absoluteFile);
  }

  const id = state.modules.size + 1;
  state.moduleIds.set(absoluteFile, id);
  state.modules.set(id, { code: null, dependencies: new Map() });

  const code = await transformModule(absoluteFile, preprocessSource);
  const dependencies = new Map();
  for (const match of code.matchAll(/require\((["'])([^"']+)\1\)/g)) {
    const specifier = match[2];
    if (!dependencies.has(specifier)) {
      const dependencyPath = resolveModule(specifier, absoluteFile);
      dependencies.set(
        specifier,
        await registerModule(dependencyPath, state, preprocessSource),
      );
    }
  }

  state.modules.set(id, { code, dependencies });
  return id;
}

function createBundle(modules, entryId) {
  const moduleCode = [];
  for (const [id, module] of modules) {
    const dependencies = Object.fromEntries(module.dependencies);
    moduleCode.push(
      `${id}: [function(module,exports,require,__dirname,__filename){${module.code}},${JSON.stringify(dependencies)}]`,
    );
  }

  return `(function(modules,entry){`
    + `var cache={},process={env:{NODE_ENV:'production'}};`
    + `function load(id){if(cache[id])return cache[id].exports;`
    + `var record=modules[id],module={exports:{}};cache[id]=module;`
    + `var deps=record[1];`
    + `function localRequire(name){return load(deps[name])}`
    + `record[0](module,module.exports,localRequire,'','');`
    + `return module.exports}`
    + `load(entry);`
    + `})({${moduleCode.join(',')}},${entryId});\n`;
}

async function buildBundles(outputDirectory, preprocessSource) {
  fs.mkdirSync(outputDirectory, { recursive: true });

  for (const [name, entry] of Object.entries(entries)) {
    const state = {
      modules: new Map(),
      moduleIds: new Map(),
    };
    const entryId = await registerModule(entry, state, preprocessSource);
    fs.writeFileSync(
      path.join(outputDirectory, `${name}.js`),
      createBundle(state.modules, entryId),
      'utf8',
    );
  }
}

module.exports = { buildBundles };
