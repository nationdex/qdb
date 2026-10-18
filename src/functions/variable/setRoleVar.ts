import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { setVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$setRoleVar",
    description: "Assigns a value to a variable stored for a role",
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
        },
        {
            name: "role ID",
            description: "The role the variable belongs to, taken from the context when omitted",
            type: ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, value, id]) {
        await setVariable("role", variableKey(ctx, "role", id), name, value);
        return this.success();
    }
});
