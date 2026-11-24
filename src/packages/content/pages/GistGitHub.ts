"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGistGithub = exports.QUERY_FILE_INFO = void 0;
const github_url_detection_1 = require("github-url-detection");
const Icons_1 = require("../utils/Icons");
const fastdom_1 = require("fastdom");
exports.QUERY_FILE_INFO = '.file-info';
const showGistIcons = async () => {
    const fileInfos = document.querySelectorAll(exports.QUERY_FILE_INFO);
    for (let i = 0; i < fileInfos.length; i++) {
        /**
         * [DIV:
         *  [SPAN: [SVG: icon]],
         *  [A: [STRONG: name]]
         * ]
         */
        const fileInfo = fileInfos[i];
        const gistName = fileInfo.lastElementChild.firstElementChild.innerText;
        const iconPath = (0, Icons_1.getIconForFile)(gistName);
        (0, fastdom_1.mutate)(() => {
            const icon = document.createElement('img');
            icon.setAttribute('src', (0, Icons_1.getIconUrl)(iconPath));
            icon.setAttribute('alt', 'icon');
            icon.setAttribute('class', 'vscode-icon');
            fileInfo.firstElementChild.replaceChildren(icon);
        });
    }
};
function update() {
    if ((0, github_url_detection_1.isGist)()) {
        showGistIcons();
    }
}
function initGistGithub() {
    update();
}
exports.initGistGithub = initGistGithub;
