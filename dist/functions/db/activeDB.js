"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$activeDB",
    description: "Returns a list of active databases",
    version: "3.0.0",
    output: forgescript_1.ArgType.String,
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "separator",
            description: "The separator",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [separator]) {
        return this.success((0, db_1.activeDB)().join(separator || ", "));
    }
});
//# sourceMappingURL=activeDB.js.map