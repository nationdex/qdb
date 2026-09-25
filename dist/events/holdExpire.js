"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const eventHandler_1 = require("../managers/eventHandler");
const main_1 = require("../main");
exports.default = new eventHandler_1.EventHandler({
    name: "holdExpire",
    description: "Triggered when a hold expires in the database (extracting data from type/key/name/value environment variables)",
    version: "3.0.0",
    listener(environment) {
        const commands = this.getExtension(main_1.QuorielDB, true).commands.get("holdExpire");
        if (commands) {
            for (const command of commands) {
                forgescript_1.Interpreter.run({ obj: {}, client: this, command, data: command.compiled.code, environment: environment });
            }
        }
    }
});
//# sourceMappingURL=holdExpire.js.map