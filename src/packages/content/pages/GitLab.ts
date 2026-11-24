"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGitLab = exports.QUERY_TREE_ITEMS = void 0;
const Icons_1 = require("../utils/Icons");
const PageDetect_1 = require("../utils/PageDetect");
const fastdom_1 = require("fastdom");
const Dev_1 = require("../utils/Dev");
exports.QUERY_TREE_ITEMS = '.tree-item';
function showRepoTreeIcons() {
    const treeItems = document.querySelectorAll(exports.QUERY_TREE_ITEMS);
    for (let i = 0; i < treeItems.length; i++) {
        /**
         * [TR:
         *  [TD: [[I: icon], [A: [SPAN: name]]]],
         *  [TD: [SPAN: [A: message]]],
         *  [TD: [TIME: ago]]
         * ]
         */
        const itemEl = treeItems[i];
        const newIconEl = document.createElement('img');
        const iconAndNameEls = itemEl.firstElementChild;
        const iconEl = iconAndNameEls.firstElementChild;
        const nameEl = iconAndNameEls.lastElementChild;
        const name = nameEl.innerText.toLowerCase();
        if (i === 0 && name === '..') {
            continue;
        }
        const iconPath = nameEl.href.indexOf('/tree/') > 0 ? (0, Dev_1.getFolderIcon)(name) : (0, Dev_1.getFileIcon)(name);
        (0, fastdom_1.mutate)(() => {
            newIconEl.setAttribute('src', (0, Icons_1.getIconUrl)(iconPath));
            newIconEl.setAttribute('class', 'vscode-icon');
            iconAndNameEls.replaceChild(newIconEl, iconEl);
        });
    }
}
function update() {
    if ((0, PageDetect_1.isGitLabRepo)()) {
        showRepoTreeIcons();
    }
}
function initGitLab() {
    update();
}
exports.initGitLab = initGitLab;
