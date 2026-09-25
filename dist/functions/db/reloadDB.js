"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
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