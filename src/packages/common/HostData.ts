"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostData = void 0;
const hostData = {
    bitbucket: {
        fullName: 'Bitbucket',
        favicon: 'bitbucket-favicon.ico',
        host: 'bitbucket',
    },
    github: {
        fullName: 'Github',
        favicon: 'github-favicon.ico',
        host: 'github',
    },
    githubgist: {
        fullName: 'Github Gist',
        favicon: 'github-favicon.ico',
        host: 'gist.github',
    },
    gitlab: {
        fullName: 'Gitlab',
        favicon: 'gitlab-favicon.ico',
        host: 'gitlab',
    },
    pastebin: {
        fullName: 'Pastebin',
        favicon: 'pastebin-favicon.ico',
        host: 'pastebin',
    },
    sourceforge: {
        fullName: 'Sourceforge',
        favicon: 'sourceforge-favicon.ico',
        host: 'sourceforge',
    },
};
function getHostData(host) {
    return hostData[host];
}
exports.getHostData = getHostData;
