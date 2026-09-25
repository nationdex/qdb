"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
const valueType = {
    string: "string",
    number: "number",
    boolean: "boolean",
    object: "object",
    array: "array"
};
exports.default = new forgescript_1.NativeFunction({
    name: "$searchDB",
    description: "Searches the database with various filters",
    version: "3.0.0",
    output: forgescript_1.ArgType.Json,
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type (if not specified, searches all open databases)",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "name",
            description: "Variable name to search for",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "valueType",
            description: "Filter by value type",
            type: forgescript_1.ArgType.Enum,
            enum: valueType,
            rest: false
        },
        {
            name: "value",
            description: "Filter by actual value",
            type: forgescript_1.ArgType.String,
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
    execute(ctx, [type, name, valueType, value, entity, guild]) {
        return this.successJSON((0, db_1.searchDB)(type, name, valueType, value, entity, guild ? guild?.id || ctx.guild.id : null));
    }
});
//# sourceMappingURL=searchDB.js.map