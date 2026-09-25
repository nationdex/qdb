"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$existsRecord",
    description: "Checks if a record exists for the key",
    version: "2.0.0",
    output: forgescript_1.ArgType.Boolean,
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
    execute(ctx, [type, key]) {
        return this.success((0, db_1.existsRecord)(type, key || (0, db_1.autoKey)(ctx, type)));
    }
});
//# sourceMappingURL=existsRecord.js.map