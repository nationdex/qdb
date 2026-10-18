import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { moveRecord } from "../../db";

export default defineFunction({
    name: "$moveRecord",
    description: "Moves data from one record to another",
    version: "3.0.0",
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
            name: "from key",
            description: "Source record key",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "to key",
            description: "Target record key",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "delete source",
            description: "Whether to delete source record after moving (default: true)",
            type: ArgType.Boolean,
            rest: false
        }
    ],
    async execute(ctx, [type, fromKey, toKey, deleteSource]) {
        return this.success(await moveRecord(type, fromKey, toKey, deleteSource));
    }
});
