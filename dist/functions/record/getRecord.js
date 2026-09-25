"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$getRecord",
    description: "Saves record data into an environment variable",
    version: "3.0.0",
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
            name: "variable",
            description: "Environment variable name",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "key",
            description: "Record key",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [type, variable, key]) {
        ctx.setEnvironmentKey(variable, (0, db_1.getRecord)(type, key || (0, db_1.autoKey)(ctx, type)));
        return this.success();
    }
});
//# sourceMappingURL=getRecord.js.map