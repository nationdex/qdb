import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { setVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$setGlobalVar",
    description: "Assigns a value to a variable stored for a global",
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
        },
        {
            name: "value",
            description: "The value to store",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    async execute(ctx, [name, value]) {
        await setVariable("global", variableKey(ctx, "global"), name, value);
        return this.success();
    }
});
