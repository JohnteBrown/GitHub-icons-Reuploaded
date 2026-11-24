"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetStorage = exports.setStorage = exports.getStorage = exports.initialStorage = void 0;
exports.initialStorage = {
    version: chrome.runtime.getManifest().version,
    showIcons: {
        github: true,
        githubgist: false,
        gitlab: true,
        bitbucket: true,
        pastebin: false,
        sourceforge: true,
    },
};
function getStorage() {
    return new Promise((resolve, reject) => {
        if (chrome.storage === undefined) {
            reject(new Error('Storage is not accessible from this part of extension'));
            return;
        }
        chrome.storage.local.get((storage) => {
            const store = storage;
            if (store.version === undefined) {
                chrome.storage.local.set(exports.initialStorage);
                resolve(exports.initialStorage);
                return;
            }
            resolve(store);
        });
    });
}
exports.getStorage = getStorage;
function setStorage(storage) {
    if (chrome.storage === undefined) {
        throw new Error('Storage is not accessible from this part of extension');
    }
    chrome.storage.local.set(storage);
}
exports.setStorage = setStorage;
function resetStorage() {
    if (chrome.storage === undefined) {
        throw new Error('Storage is not accessible from this part of extension');
    }
    chrome.storage.local.set(exports.initialStorage);
    return exports.initialStorage;
}
exports.resetStorage = resetStorage;
