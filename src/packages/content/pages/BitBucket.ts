"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBitBucket = exports.QUERY_ICONS_TO_REPLACE = exports.QUERY_FILE_TABLE_ROWS = void 0;
const Icons_1 = require("../utils/Icons");
const Dev_1 = require("../utils/Dev");
const PageDetect_1 = require("../utils/PageDetect");
const fastdom_1 = require("fastdom");
exports.QUERY_FILE_TABLE_ROWS = 'table[data-qa="repository-directory"] > tbody > tr';
exports.QUERY_ICONS_TO_REPLACE = `${exports.QUERY_FILE_TABLE_ROWS} a svg`;
function showRepoTreeIcons() {
    if (!(0, PageDetect_1.isBitBucketRepo)())
        return;
    if (!document.querySelector(exports.QUERY_FILE_TABLE_ROWS) || !document.querySelector(exports.QUERY_ICONS_TO_REPLACE))
        return;
    const treeItems = document.querySelectorAll(exports.QUERY_FILE_TABLE_ROWS);
    for (let i = 0; i < treeItems.length; i++) {
        /**
         * [TR:
         *  [TD: [DIV: [A: [SPAN: [SVG: icon]]]]]
         *  [TD: [A: name]]
         * ]
         */
        const itemEl = treeItems[i];
        const iconAnchorEl = itemEl.firstChild.firstChild.firstChild;
        const iconEl = iconAnchorEl.firstChild;
        const nameAnchorEl = itemEl.children[1].firstChild;
        if (document.querySelector(`${exports.QUERY_FILE_TABLE_ROWS}:nth-child(${i + 1}) img.vscode-icon.bb-icon`)) {
            continue;
        }
        const newIconEl = document.createElement('img');
        newIconEl.setAttribute('class', 'vscode-icon bb-icon');
        const replaceNodeIfExists = (replacementIcon) => {
            // used to prevent replacing of none existing nodes
            if (!document.querySelector(`${exports.QUERY_FILE_TABLE_ROWS}:nth-child(${i + 1}) img.vscode-icon.bb-icon`)) {
                iconAnchorEl.replaceChild(replacementIcon, iconEl);
            }
        };
        if (iconAnchorEl.href === '..') {
            // ..
            continue;
        }
        else if (iconAnchorEl.href.endsWith('/')) {
            // FOLDER
            const name = nameAnchorEl.innerText.toLowerCase();
            const iconPath = (0, Dev_1.getFolderIcon)(name);
            (0, fastdom_1.mutate)(() => {
                newIconEl.setAttribute('src', (0, Icons_1.getIconUrl)(iconPath));
                replaceNodeIfExists(newIconEl);
            });
        }
        else if (itemEl.className.includes('subreponame')) {
            // TODO: SUBMODULE
            (0, fastdom_1.mutate)(() => {
                newIconEl.setAttribute('src', (0, Icons_1.getIconUrl)((0, Icons_1.getIconForFolder)('submodules')));
                replaceNodeIfExists(newIconEl);
            });
        }
        else {
            // FILE
            const name = nameAnchorEl.innerText.toLowerCase();
            const iconPath = (0, Dev_1.getFileIcon)(name);
            (0, fastdom_1.mutate)(() => {
                newIconEl.setAttribute('src', (0, Icons_1.getIconUrl)(iconPath));
                replaceNodeIfExists(newIconEl);
            });
        }
    }
}
function update() {
    showRepoTreeIcons();
}
function initBitBucket() {
    update();
    window.addEventListener('message', update);
}
exports.initBitBucket = initBitBucket;
