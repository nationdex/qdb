"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
const sortType = {
    asc: "asc",
    desc: "desc"
};
exports.default = new forgescript_1.NativeFunction({
    name: "$leaderBoard",
    description: "Loads the entire sorted ranked list into the environment variable",
    version: "3.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "variable",
            description: "Environment variable name",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "type",
            description: "Data type",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "name",
            description: "Variable name",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "sorting",
            description: "Sorting type",
            type: forgescript_1.ArgType.Enum,
            enum: sortType,
            rest: false
        },
        {
            name: "guild",
            description: "Guild identifier",
            type: forgescript_1.ArgType.Guild,
            rest: false
        }
    ],
    execute(ctx, [variable, type, name, sorting, guild]) {
        ctx.setEnvironmentKey(variable, (0, db_1.leaderBoard)(type, name, sorting, guild?.id || ctx.guild.id));
        return this.success();
    }
});
//# sourceMappingURL=leaderBoard.js.map