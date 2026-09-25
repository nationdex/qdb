"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$moveRecord",
    description: "Moves data from one record to another",
    version: "3.0.0",
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
            name: "from key",
            description: "Source record key",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "to key",
            description: "Target record key",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "delete source",
            description: "Whether to delete source record after moving (default: true)",
            type: forgescript_1.ArgType.Boolean,
            rest: false
        }
    ],
    async execute(ctx, [type, fromKey, toKey, deleteSource]) {
        return this.success(await (0, db_1.moveRecord)(type, fromKey, toKey, deleteSource));
    }
});
//# sourceMappingURL=moveRecord.js.map