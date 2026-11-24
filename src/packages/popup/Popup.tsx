"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const Messenger_1 = require("../common/Messenger");
const HostData_1 = require("../common/HostData");
class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggleClick = (hosting) => {
            const prevStorage = this.state.storage;
            const newStorage = {
                ...prevStorage,
                showIcons: {
                    ...prevStorage.showIcons,
                    [hosting]: !prevStorage.showIcons[hosting],
                },
            };
            (0, Messenger_1.sendMessage)({ type: 'STORAGE_SET', storage: newStorage });
            this.setState({
                storage: newStorage,
                isSomethingChanged: true,
            });
        };
        this.handleResetButton = async () => {
            const defaultState = (await (0, Messenger_1.sendMessage)({ type: 'STORAGE_RESET' }));
            this.setState({
                storage: defaultState,
            });
        };
        this.state = {
            storage: props.storage,
            isSomethingChanged: false,
        };
    }
    render() {
        const hostings = Object.keys(this.props.storage.showIcons);
        const changedText = this.state.isSomethingChanged ? (React.createElement("p", { style: { color: 'orange' } },
            React.createElement("i", null, "In order to see changes on pages, please reload them using refresh button"))) : null;
        return (React.createElement("div", { id: "settings" },
            React.createElement("h3", null, "display icons for:"),
            React.createElement("div", null,
                hostings.map((hosting, index) => {
                    const hostData = (0, HostData_1.getHostData)(hosting);
                    return (React.createElement("div", { key: index, className: "form-group", style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                        React.createElement("label", { className: "form-checkbox" },
                            hostData.fullName,
                            React.createElement("input", { type: "checkbox", checked: this.state.storage.showIcons[hosting], onChange: () => this.handleToggleClick(hosting) }),
                            React.createElement("i", { className: "form-icon" })),
                        React.createElement("img", { className: "vsi-icon", src: chrome.runtime.getURL(`favicons/${hostData.favicon}`) })));
                }),
                changedText)));
    }
}
(async function () {
    const storage = (await (0, Messenger_1.sendMessage)({ type: 'STORAGE_GET' }));
    ReactDOM.render(React.createElement(Popup, { storage: storage }), document.getElementById('app'));
})();
