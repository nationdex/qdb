import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { getVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$getRoleVar",
    description: "Retrieves the value of a variable stored for a role",
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
            name: "role ID",
            description: "The role the variable belongs to, taken from the context when omitted",
            type: ArgType.String,
            rest: false
        },
        {
            name: "default",
            description: "The value to return when the variable is not set",
            type: ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [name, id, fallback]) {
        return this.successJSON(getVariable("role", variableKey(ctx, "role", id), name, fallback));
    }
});
