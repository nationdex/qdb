import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { deleteVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$deleteGlobalVar",
    description: "Removes a variable stored for a global",
    version: "3.1.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "name",
            description: "The name of the variable",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name]) {
        await deleteVariable("global", variableKey(ctx, "global"), name);
        return this.success();
    }
});
