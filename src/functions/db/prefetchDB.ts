import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { prefetchDB } from "../../db";

export default defineFunction({
    name: "$prefetchDB",
    description: "Prefetches database entries into memory to speed up future access",
    version: "2.0.0",
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
            name: "keys",
            description: "Record keys",
            type: ArgType.String,
            required: true,
            rest: true
        }
    ],
    async execute(ctx, [type, keys]) {
        await prefetchDB(type, keys);
        return this.success();
    }
});
