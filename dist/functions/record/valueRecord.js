"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$valueRecord",
    description: "Gets a variable value from a record",
    version: "3.0.0",
    output: forgescript_1.ArgType.Unknown,
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
            name: "name",
            description: "Variable name",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "key",
            description: "Record key",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [type, name, key]) {
        return this.successJSON((0, db_1.valueRecord)(type, key || (0, db_1.autoKey)(ctx, type), name));
    }
});
//# sourceMappingURL=valueRecord.js.map