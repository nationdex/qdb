import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { autoKey, existsRecord } from "../../db";

export default defineFunction({
    name: "$existsRecord",
    description: "Checks if a record exists for the key",
    version: "2.0.0",
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
        },
        {
            name: "key",
            description: "Record key",
            type: ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [type, key]) {
        return this.success(existsRecord(type, key || autoKey(ctx, type)));
    }
});
