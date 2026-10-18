"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$deleteMemberVar",
    description: "Removes a variable stored for a member",
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
            name: "member ID",
            description: "The member the variable belongs to, taken from the context when omitted",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "guild ID",
            description: "The guild the variable belongs to, taken from the context when omitted",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, id0, id1]) {
        await (0, db_1.deleteVariable)("member", (0, db_1.variableKey)(ctx, "member", id0, id1), name);
        return this.success();
    }
});
//# sourceMappingURL=deleteMemberVar.js.map