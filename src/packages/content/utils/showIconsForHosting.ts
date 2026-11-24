"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showIconsForHosting = void 0;
const BitBucket_1 = require("../pages/BitBucket");
const GistGitHub_1 = require("../pages/GistGitHub");
const GitHub_1 = require("../pages/GitHub");
const GitLab_1 = require("../pages/GitLab");
const PasteBin_1 = require("../pages/PasteBin");
const SourceForge_1 = require("../pages/SourceForge");
/**
 * @param host - will show icons on page for host
 */
function showIconsForHosting(host) {
    const funcsToShowIcons = {
        bitbucket: BitBucket_1.initBitBucket,
        githubgist: GistGitHub_1.initGistGithub,
        github: GitHub_1.initGithub,
        gitlab: GitLab_1.initGitLab,
        pastebin: PasteBin_1.initPasteBin,
        sourceforge: SourceForge_1.initSourceForge,
    };
    funcsToShowIcons[host]();
}
exports.showIconsForHosting = showIconsForHosting;
