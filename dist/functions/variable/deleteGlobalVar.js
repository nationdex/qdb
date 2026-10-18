"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$deleteGlobalVar",
    description: "Removes a variable stored for a global",
    version: "3.1.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "name",
            description: "The name of the variable",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        await (0, db_1.deleteVariable)("global", (0, db_1.variableKey)(ctx, "global"), name);
        return this.success();
    }
});
//# sourceMappingURL=deleteGlobalVar.js.map