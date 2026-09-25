"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$rangeDB",
    description: "Retrieves all records from the database",
    version: "2.0.0",
    output: forgescript_1.ArgType.Json,
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
    execute(ctx, [type]) {
        return this.successJSON((0, db_1.rangeDB)(type));
    }
});
//# sourceMappingURL=rangeDB.js.map