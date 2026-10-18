"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
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