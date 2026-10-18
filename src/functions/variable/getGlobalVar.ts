import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { getVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$getGlobalVar",
    description: "Retrieves the value of a variable stored for a global",
    version: "3.1.0",
    output: ArgType.Unknown,
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
            name: "default",
            description: "The value to return when the variable is not set",
            type: ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [name, fallback]) {
        return this.successJSON(getVariable("global", variableKey(ctx, "global"), name, fallback));
    }
});
