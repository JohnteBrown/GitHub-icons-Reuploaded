# GitHub VS Code Icons Reuploaded & Revitalized.

A Manifest V3 browser extension that replaces githubs default icons with some snazzy vscode file and folder icons, with support for other sites ofc.

## Development

Requirements:

- Node.js 20 or newer
- npm

Install dependencies:

```sh
npm install
```

Jake manages the workspace tasks. The build is generated in `dist/` using SWC/SPack.

## Load the extension

1. Run `npm run build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Choose **Load unpacked** and select the `dist/` directory.
