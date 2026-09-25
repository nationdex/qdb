"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$removeRecord",
    description: "Deletes the record of the specified key",
    version: "3.0.0",
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
            name: "key",
            description: "Record key",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [type, key]) {
        await (0, db_1.removeRecord)(type, key || (0, db_1.autoKey)(ctx, type));
        return this.success();
    }
});
//# sourceMappingURL=removeRecord.js.map