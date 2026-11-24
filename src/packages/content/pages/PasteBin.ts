"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPasteBin = void 0;
const Icons_1 = require("../utils/Icons");
const PageDetect_1 = require("../utils/PageDetect");
const fastdom_1 = require("fastdom");
const QUERY_PASTEBIN_ITEMS = '.maintable>tbody>tr';
function showIconsForFiles() {
    const pastes = document.querySelectorAll(QUERY_PASTEBIN_ITEMS);
    // skip first tr, which is header
    for (let i = 1; i < pastes.length; i++) {
        /**
         * [TR:
         *  [TD: [[IMAGE: icon], [A: name]]],
         *  [TD: added],
         *  [TD: expires],
         *  [TD: hits],
         *  [TD: [A: syntax]],
         *  [TD: ?]
         * ]
         */
        const item = pastes[i];
        const iconAndNameEl = item.firstElementChild;
        const iconEl = iconAndNameEl.firstElementChild;
        const syntaxEl = item.childNodes[9];
        const syntaxName = syntaxEl.innerText;
        const iconPath = (0, Icons_1.getIconForPBSyntax)(syntaxName);
        const newIconEl = document.createElement('img');
        (0, fastdom_1.mutate)(() => {
            newIconEl.setAttribute('src', (0, Icons_1.getIconUrl)(iconPath));
            newIconEl.setAttribute('class', 'vscode-icon vsi-pb');
            iconAndNameEl.replaceChild(newIconEl, iconEl);
        });
    }
}
function showIconForPaste() {
    // TODO:
}
function update() {
    if (PageDetect_1.isPastebinUserList()) {
        showIconsForFiles();
    }
    else if (PageDetect_1.isPasteOpen) {
        showIconForPaste();
    }
}
function initPasteBin() {
    update();
}
exports.initPasteBin = initPasteBin;
