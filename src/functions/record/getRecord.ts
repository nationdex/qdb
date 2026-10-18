import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { autoKey, getRecord } from "../../db";

export default defineFunction({
    name: "$getRecord",
    description: "Saves record data into an environment variable",
    version: "3.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "variable",
            description: "Environment variable name",
            type: ArgType.String,
            rest: false
        },
        {
            name: "key",
            description: "Record key",
            type: ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [type, variable, key]) {
        ctx.setEnvironmentKey(variable!, getRecord(type, key || autoKey(ctx, type)));
        return this.success();
    }
});
