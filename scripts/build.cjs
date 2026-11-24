const fs = require('fs');
const path = require('path');
const swc = require('@swc/core');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const entries = {
  background: path.join(root, 'src/packages/background/Background.ts'),
  content: path.join(root, 'src/packages/content/Content.ts'),
  popup: path.join(root, 'src/packages/popup/Popup.tsx'),
};

const modules = new Map();
const moduleIds = new Map();

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
  } catch {
    throw new Error(`Cannot resolve "${specifier}" from ${importer}`);
  }
}

function transformModule(file) {
  if (file.endsWith('.json')) {
    return `module.exports = ${JSON.stringify(JSON.parse(fs.readFileSync(file, 'utf8')))};`;
  }

  const result = swc.transformFileSync(file, {
    jsc: {
      parser: {
        syntax: path.extname(file) === '.tsx' || path.extname(file) === '.ts'
          ? 'typescript'
          : 'ecmascript',
        tsx: path.extname(file) === '.tsx',
      },
      target: 'es2022',
      transform: {
        optimizer: {
          globals: {
            vars: {
              'process.env.NODE_ENV': '"production"',
            },
          },
        },
      },
    },
    module: {
      type: 'commonjs',
    },
    minify: true,
  });

  return result.code;
}

function registerModule(file) {
  const absoluteFile = path.resolve(file);
  if (moduleIds.has(absoluteFile)) {
    return moduleIds.get(absoluteFile);
  }

  const id = modules.size + 1;
  moduleIds.set(absoluteFile, id);
  modules.set(id, { file: absoluteFile, code: null, dependencies: new Map() });

  const code = transformModule(absoluteFile);
  const dependencies = new Map();
  for (const match of code.matchAll(/require\((["'])([^"']+)\1\)/g)) {
    const specifier = match[2];
    if (!dependencies.has(specifier)) {
      dependencies.set(specifier, registerModule(resolveModule(specifier, absoluteFile)));
    }
  }

  modules.get(id).code = code;
  modules.get(id).dependencies = dependencies;
  return id;
}

function escapeString(value) {
  return JSON.stringify(value);
}

fs.mkdirSync(dist, { recursive: true });

for (const [name, entry] of Object.entries(entries)) {
  const entryId = registerModule(entry);
  const moduleCode = [];

  for (const [id, module] of modules) {
    const deps = Object.fromEntries(
      [...module.dependencies].map(([specifier, dependencyId]) => [specifier, dependencyId]),
    );
    moduleCode.push(
      `${id}: [function(module,exports,require,__dirname,__filename){${module.code}},${escapeString(deps)}]`,
    );
  }

  const bundle = `(function(modules,entry){`
    + `var cache={};`
    + `function load(id){if(cache[id])return cache[id].exports;`
    + `var record=modules[id],module={exports:{}};cache[id]=module;`
    + `var deps=record[1];`
    + `function localRequire(name){return load(deps[name])}`
    + `record[0](module,module.exports,localRequire,'',record[2]||'');`
    + `return module.exports}`
    + `load(entry);`
    + `})({${moduleCode.join(',')}},${entryId});\n`;

  fs.writeFileSync(path.join(dist, `${name}.js`), bundle, 'utf8');
}
