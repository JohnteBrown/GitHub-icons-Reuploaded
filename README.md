# GitHub VS Code Icons Reuploaded & Revitalized.

A Manifest V3 browser extension that displays VS Code-style file and folder icons on supported code-hosting websites.

## Development

Requirements:

- Node.js 20 or newer
- npm

Install dependencies:

```sh
npm install
```

Available tasks:

```sh
npm run lint
npm run lint:fix
npm run build
npm run verify
```

Jake manages the workspace tasks. The build is generated in `dist/` using SWC/SPack.

## Load the extension

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked** and select the `dist/` directory.
