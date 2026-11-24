"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSourceForge = exports.QUERY_SOURCEFORGE_ITEMS = void 0;
const Icons_1 = require("../utils/Icons");
const PageDetect_1 = require("../utils/PageDetect");
const fastdom_1 = require("fastdom");
const Dev_1 = require("../utils/Dev");
exports.QUERY_SOURCEFORGE_ITEMS = '#files_list>tbody>tr';
function showIconsForFiles() {
    const items = document.querySelectorAll(exports.QUERY_SOURCEFORGE_ITEMS);
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const newIconEl = document.createElement('img');
        newIconEl.setAttribute('class', 'vscode-icon sf-icon');
        const iconAndNameEl = item.firstElementChild.firstElementChild;
        const isFolder = item.className.includes('folder');
        if (isFolder) {
            /**
             * [TR:
             *  [TH: [A: [SVG: icon], [SPAN: folderName]]],
             *  [TD: [ABBR: date]],
             *  [TD: size],
             *  [TD: [DIV: Populated by JS], [DIV: [A: chart]]],
             * ]
             */
            const iconEl = iconAndNameEl.firstElementChild;
            const nameEl = iconAndNameEl.lastElementChild;
            const name = nameEl.innerText.toLowerCase();
            const iconPath = (0, Dev_1.getFolderIcon)(name);
            (0, fastdom_1.mutate)(() => {
                newIconEl.setAttribute('src', (0, Icons_1.getIconUrl)(iconPath));
                iconAndNameEl.replaceChild(newIconEl, iconEl);
            });
        }
        else {
            /**
             * [TR:
             *  [TH: [A: [SVG: icon]]],
             *  [TD: [ABBR: date]],
             *  [TD: size],
             *  [TD: [DIV: Populated by JS], [DIV: [A: chart]]],
             * ]
             */
            const nameEl = iconAndNameEl.firstElementChild;
            const name = nameEl.innerText.toLowerCase();
            const iconPath = (0, Dev_1.getFileIcon)(name);
            (0, fastdom_1.mutate)(() => {
                newIconEl.setAttribute('src', (0, Icons_1.getIconUrl)(iconPath));
                iconAndNameEl.insertBefore(newIconEl, nameEl);
            });
        }
    }
}
function update() {
    if ((0, PageDetect_1.isSourceForgeFiles)()) {
        showIconsForFiles();
    }
}
function initSourceForge() {
    update();
}
exports.initSourceForge = initSourceForge;
