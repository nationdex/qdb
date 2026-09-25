"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$createBackup",
    description: "Creates a backup of the specified database",
    version: "2.0.0",
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
        await (0, db_1.createBackup)(type);
        return this.success();
    }
});
//# sourceMappingURL=createBackup.js.map