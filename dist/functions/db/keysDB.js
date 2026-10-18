"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$keysDB",
    description: "Retrieves all keys from the database",
    version: "3.0.0",
    output: forgescript_1.ArgType.String,
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
            name: "separator",
            description: "The separator",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [type, separator]) {
        return this.success((0, db_1.keysDB)(type).join(separator || ", "));
    }
});
//# sourceMappingURL=keysDB.js.map