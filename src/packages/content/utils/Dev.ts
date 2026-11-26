"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.save = exports.getFileIcon = exports.getFolderIcon = void 0;
const VSCJS = require("vscode-icons-ts");
exports.getFolderIcon = process.env.NODE_ENV === 'production'
    ? VSCJS.getIconForFolder
    : (folderName) => {
        const folderIcon = VSCJS.getIconForFolder(folderName);
        if (folderIcon === VSCJS.DEFAULT_FOLDER) {
            (0, exports.save)('FOLDER', folderName);
        }
        return folderIcon;
    };
exports.getFileIcon = process.env.NODE_ENV === 'production'
    ? VSCJS.getIconForFile
    : (filename) => {
        const fileIcon = VSCJS.getIconForFile(filename);
        if (fileIcon === VSCJS.DEFAULT_FILE) {
            (0, exports.save)('FILE', filename);
        }
        return fileIcon;
    };
/**
 * Save name of file/folder that doesn't have an icon
 */
const save = (type, name) => {
    const allItemsStr = localStorage.getItem('items');
    if (allItemsStr) {
        const items = JSON.parse(allItemsStr);
        const names = type === 'FOLDER' ? items.folders : items.files;
        if (name in names) {
            names[name] = names[name] + 1;
        }
        else {
            names[name] = 1;
        }
        localStorage.setItem('items', JSON.stringify(items));
    }
    else {
        const items = { folders: {}, files: {} };
        const names = type === 'FOLDER' ? items.folders : items.files;
        names[name] = 1;
        localStorage.setItem('items', JSON.stringify(items));
    }
};
exports.save = save;
/**
 * Load name of file/folder that doesn't have an icon
 */
const load = () => {
    const allItemsStr = localStorage.getItem('items');
    if (allItemsStr) {
        return JSON.parse(allItemsStr);
    }
    else {
        return {
            files: {},
            folders: {},
        };
    }
};
exports.load = load;