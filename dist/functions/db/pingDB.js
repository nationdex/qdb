"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$pingDB",
    description: "Checks the database response time",
    version: "2.0.0",
    output: forgescript_1.ArgType.Number,
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
        return this.success((0, db_1.pingDB)(type));
    }
});
//# sourceMappingURL=pingDB.js.map