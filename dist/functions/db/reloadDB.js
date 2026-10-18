"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const define_1 = require("../../define");
const db_1 = require("../../db");
exports.default = (0, define_1.defineFunction)({
    name: "$reloadDB",
    description: "Reloads database configuration from file",
    version: "3.0.0",
    unwrap: false,
    async execute(ctx) {
        await (0, db_1.reloadDB)();
        return this.success();
    }
});
//# sourceMappingURL=reloadDB.js.map