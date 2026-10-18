"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$getRoleVar",
    description: "Retrieves the value of a variable stored for a role",
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
            name: "role ID",
            description: "The role the variable belongs to, taken from the context when omitted",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "default",
            description: "The value to return when the variable is not set",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [name, id, fallback]) {
        return this.successJSON((0, db_1.getVariable)("role", (0, db_1.variableKey)(ctx, "role", id), name, fallback));
    }
});
//# sourceMappingURL=getRoleVar.js.map