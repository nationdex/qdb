import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { openDB } from "../../db";

export default defineFunction({
    name: "$openDB",
    description: "Opens a connection to one or more databases",
    version: "3.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "types",
            description: "Data type(s)",
            type: ArgType.String,
            required: true,
            rest: true
        }
    ],
    execute(ctx, [array]) {
        openDB(array);
        return this.success();
    }
});
