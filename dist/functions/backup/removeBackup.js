"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$removeBackup",
    description: "Removes a backup of the specified data type",
    version: "1.7.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [type]) {
        await (0, db_1.removeBackup)(type);
        return this.success();
    }
});
//# sourceMappingURL=removeBackup.js.map