"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$prefetchDB",
    description: "Prefetches database entries into memory to speed up future access",
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
        },
        {
            name: "keys",
            description: "Record keys",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: true
        }
    ],
    async execute(ctx, [type, keys]) {
        await (0, db_1.prefetchDB)(type, keys);
        return this.success();
    }
});
//# sourceMappingURL=prefetchDB.js.map