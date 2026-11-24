"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStorage_1 = require("../common/LocalStorage");
const Messenger_1 = require("../common/Messenger");
(0, Messenger_1.onMessage)(async (message, _, sendResponse) => {
    switch (message.type) {
        case 'STORAGE_GET': {
            const storage = await (0, LocalStorage_1.getStorage)();
            sendResponse(storage);
            break;
        }
        case 'STORAGE_SET': {
            const storage = message.storage;
            (0, LocalStorage_1.setStorage)(storage);
            break;
        }
        case 'STORAGE_RESET': {
            (0, LocalStorage_1.resetStorage)();
            break;
        }
    }
});
