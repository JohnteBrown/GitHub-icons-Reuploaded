"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Messenger_1 = require("../common/Messenger");
const HostData_1 = require("../common/HostData");
const showIconsForHosting_1 = require("./utils/showIconsForHosting");
const hostLocation = location.host;
(async function () {
    const storage = (await (0, Messenger_1.sendMessage)({ type: 'STORAGE_GET' }));
    const hosts = Object.keys(storage.showIcons);
    for (const host of hosts) {
        const hostingData = (0, HostData_1.getHostData)(host);
        const isShowIconsTurnedOn = storage.showIcons[host];
        if (isShowIconsTurnedOn && hostLocation.includes(hostingData.host)) {
            (0, showIconsForHosting_1.showIconsForHosting)(host);
            break; // we don't need to iterate over another hostings when already displayed icons
        }
    }
})();
