"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = exports.sendMessage = void 0;
function sendMessage(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, (response) => {
            if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            resolve(response);
        });
    });
}
exports.sendMessage = sendMessage;
function onMessage(callback) {
    chrome.runtime.onMessage.addListener((internalMessage, internalSender, internalSendResponse) => {
        callback(internalMessage, internalSender, internalSendResponse);
        return true;
    });
}
exports.onMessage = onMessage;
