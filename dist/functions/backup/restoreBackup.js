"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$restoreBackup",
    description: "Restores database from backup if the database is not active",
    version: "1.7.0",
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
        }
    ],
    async execute(ctx, [type]) {
        return this.success(await (0, db_1.restoreBackup)(type));
    }
});
//# sourceMappingURL=restoreBackup.js.map