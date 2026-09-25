"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const eventHandler_1 = require("../managers/eventHandler");
const main_1 = require("../main");
exports.default = new eventHandler_1.EventHandler({
    name: "recordRemove",
    description: "Triggered when an entity record is deleted from the database (extracting data from type/key/value environment variables)",
    version: "1.4.1",
    listener(environment) {
        const commands = this.getExtension(main_1.QuorielDB, true).commands.get("recordRemove");
        if (commands) {
            for (const command of commands) {
                forgescript_1.Interpreter.run({ obj: {}, client: this, command, data: command.compiled.code, environment: environment });
            }
        }
    }
});
//# sourceMappingURL=recordRemove.js.map