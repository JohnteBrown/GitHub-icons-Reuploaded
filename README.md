# GitHub VS Code Icons

A Manifest V3 browser extension that replaces githubs default icons with some snazzy vscode file and folder icons, with support for other sites ofc.

## Requirements

- Node.js 20 or newer
- npm
- A C++17 compiler and CMake 3.15 or newer for the Jsonnet native module. On Windows, install Visual Studio Build Tools with **Desktop development with C++**, the Windows SDK, and CMake tools.

Install dependencies:

```sh
npm install
```

The outputs are independent unpacked extensions in `dist/Chromium/`, `dist/Edge/`, and `dist/Firefox/`. The build retains the existing SWC compilation and module-linking pipeline. Browser manifests are maintained as `.jsonnet` files, reusable Jsonnet libraries as `.libsonnet`, and the target AWK programs as `.awk` files in `conf/manifests/`.

The Firefox add-on ID defaults to `github-icons@example.org`. Override it before building if you have a different ID for signing:

```powershell
$env:GECKO_EXTENSION_ID = "your-addon@example.org"
npm run build:firefox
```

The Firefox manifest declares `data_collection_permissions.required` as `["none"]`; the current extension does not transmit collected data outside the browser.

## Load an unpacked build

- Chromium: open `chrome://extensions`, enable Developer mode, select **Load unpacked**, and choose `dist/Chromium/`.
- Microsoft Edge: open `edge://extensions`, enable Developer mode, select **Load unpacked**, and choose `dist/Edge/`.
- Firefox: open `about:debugging#/runtime/this-firefox`, choose **Load Temporary Add-on**, and select `dist/Firefox/manifest.json`.

## Build tasks

Jake is the primary task runner (old ik.). Build all browser packages or a single target:

```sh
npm run build
npm run build:chromium
npm run build:edge
npm run build:firefox
npm run lint
npm run verify
npm run clean
```