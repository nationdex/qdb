"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$setMessageVar",
    description: "Assigns a value to a variable stored for a message",
    version: "3.1.0",
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
            name: "value",
            description: "The value to store",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "message ID",
            description: "The message the variable belongs to, taken from the context when omitted",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, value, id]) {
        await (0, db_1.setVariable)("message", (0, db_1.variableKey)(ctx, "message", id), name, value);
        return this.success();
    }
});
//# sourceMappingURL=setMessageVar.js.map