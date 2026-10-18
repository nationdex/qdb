"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$deleteGuildVar",
    aliases: ["$deleteServerVar"],
    description: "Removes a variable stored for a guild",
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
            name: "guild ID",
            description: "The guild the variable belongs to, taken from the context when omitted",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, id]) {
        await (0, db_1.deleteVariable)("guild", (0, db_1.variableKey)(ctx, "guild", id), name);
        return this.success();
    }
});
//# sourceMappingURL=deleteGuildVar.js.map