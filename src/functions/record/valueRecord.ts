import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { autoKey, valueRecord } from "../../db";

export default defineFunction({
    name: "$valueRecord",
    description: "Gets a variable value from a record",
    version: "3.0.0",
    output: ArgType.Unknown,
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
            name: "name",
            description: "Variable name",
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
    execute(ctx, [type, name, key]) {
        return this.successJSON(valueRecord(type, key || autoKey(ctx, type), name));
    }
});
