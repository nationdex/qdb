"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$wipeDB",
    description: "Deletes one or more databases",
    version: "2.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type(s)",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: true
        }
    ],
    async execute(ctx, [array]) {
        await (0, db_1.wipeDB)(array);
        return this.success();
    }
});
//# sourceMappingURL=wipeDB.js.map