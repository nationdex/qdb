"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$key",
    description: "Builds a composite key",
    version: "2.0.0",
    output: forgescript_1.ArgType.String,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "entity",
            description: "Entity identifier",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "guild",
            description: "Guild identifier",
            type: forgescript_1.ArgType.Guild,
            rest: false
        }
    ],
    async execute(ctx, [type, entity, guild]) {
        return this.success((0, db_1.makeKey)(ctx, type, entity, guild?.id));
    }
});
//# sourceMappingURL=key.js.map