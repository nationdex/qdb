"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const main_1 = require("../main");
class EventHandler extends forgescript_1.BaseEventHandler {
    register(client) {
        client.getExtension(main_1.QuorielDB, true)["emitter"].on(this.name, this.listener.bind(client));
    }
}
exports.EventHandler = EventHandler;
//# sourceMappingURL=eventHandler.js.map