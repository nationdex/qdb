import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { restoreBackup } from "../../db";

export default defineFunction({
    name: "$restoreBackup",
    description: "Restores database from backup if the database is not active",
    version: "1.7.0",
    output: ArgType.Boolean,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [type]) {
        return this.success(await restoreBackup(type));
    }
});
