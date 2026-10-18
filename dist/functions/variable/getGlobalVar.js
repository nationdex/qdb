"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$getGlobalVar",
    description: "Retrieves the value of a variable stored for a global",
    version: "3.1.0",
    output: forgescript_1.ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "name",
            description: "The name of the variable",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "default",
            description: "The value to return when the variable is not set",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [name, fallback]) {
        return this.successJSON((0, db_1.getVariable)("global", (0, db_1.variableKey)(ctx, "global"), name, fallback));
    }
});
//# sourceMappingURL=getGlobalVar.js.map