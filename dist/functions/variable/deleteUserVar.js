"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$deleteUserVar",
    description: "Removes a variable stored for a user",
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
            name: "user ID",
            description: "The user the variable belongs to, taken from the context when omitted",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, id]) {
        await (0, db_1.deleteVariable)("user", (0, db_1.variableKey)(ctx, "user", id), name);
        return this.success();
    }
});
//# sourceMappingURL=deleteUserVar.js.map