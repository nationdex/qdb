"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const eventHandler_1 = require("../managers/eventHandler");
const main_1 = require("../main");
exports.default = new eventHandler_1.EventHandler({
    name: "databaseConnect",
    description: "Called when QuorielDB connects to ForgeScript",
    version: "2.0.0",
    listener() {
        const commands = this.getExtension(main_1.QuorielDB, true).commands.get("databaseConnect");
        if (commands) {
            for (const command of commands) {
                forgescript_1.Interpreter.run({ obj: {}, client: this, command, data: command.compiled.code });
            }
        }
    }
});
//# sourceMappingURL=databaseConnect.js.map