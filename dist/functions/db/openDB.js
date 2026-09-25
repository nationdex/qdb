"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$openDB",
    description: "Opens a connection to one or more databases",
    version: "3.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "types",
            description: "Data type(s)",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: true
        }
    ],
    execute(ctx, [array]) {
        (0, db_1.openDB)(array);
        return this.success();
    }
});
//# sourceMappingURL=openDB.js.map