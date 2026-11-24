"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIconForPBSyntax = exports.getIconUrl = exports.DEFAULT_ROOT = exports.DEFAULT_ROOT_OPENED = exports.DEFAULT_FOLDER_OPENED = exports.DEFAULT_FOLDER = exports.DEFAULT_FILE = exports.getIconForOpenFolder = exports.getIconForFolder = exports.getIconForFile = void 0;
var vscode_icons_ts_1 = require("vscode-icons-ts");
Object.defineProperty(exports, "getIconForFile", { enumerable: true, get: function () { return vscode_icons_ts_1.getIconForFile; } });
Object.defineProperty(exports, "getIconForFolder", { enumerable: true, get: function () { return vscode_icons_ts_1.getIconForFolder; } });
Object.defineProperty(exports, "getIconForOpenFolder", { enumerable: true, get: function () { return vscode_icons_ts_1.getIconForOpenFolder; } });
Object.defineProperty(exports, "DEFAULT_FILE", { enumerable: true, get: function () { return vscode_icons_ts_1.DEFAULT_FILE; } });
Object.defineProperty(exports, "DEFAULT_FOLDER", { enumerable: true, get: function () { return vscode_icons_ts_1.DEFAULT_FOLDER; } });
Object.defineProperty(exports, "DEFAULT_FOLDER_OPENED", { enumerable: true, get: function () { return vscode_icons_ts_1.DEFAULT_FOLDER_OPENED; } });
Object.defineProperty(exports, "DEFAULT_ROOT_OPENED", { enumerable: true, get: function () { return vscode_icons_ts_1.DEFAULT_ROOT_OPENED; } });
Object.defineProperty(exports, "DEFAULT_ROOT", { enumerable: true, get: function () { return vscode_icons_ts_1.DEFAULT_ROOT; } });
const vscode_icons_ts_2 = require("vscode-icons-ts");
const PBSyntaxesToIcon = require('../data/PastebinSyntaxesToIcon.json');
/**
 * Retrieve url of icon within chrome
 */
const getIconUrl = (iconFileName) => chrome.runtime.getURL('icons/' + iconFileName);
exports.getIconUrl = getIconUrl;
/**
 * Get icon for a pastebin syntaxes
 * @desc list of supported syntaxes https://pastebin.com/languages
 * @param syntaxName name of syntax to icon for
 * @return icon filename
 */
function getIconForPBSyntax(syntaxName) {
    const syntaxIcon = PBSyntaxesToIcon[syntaxName];
    if (syntaxIcon !== undefined && syntaxIcon !== '') {
        return syntaxIcon;
    }
    return vscode_icons_ts_2.DEFAULT_FILE;
}
exports.getIconForPBSyntax = getIconForPBSyntax;
