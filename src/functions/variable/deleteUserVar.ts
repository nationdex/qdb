import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { deleteVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$deleteUserVar",
    description: "Removes a variable stored for a user",
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
            name: "user ID",
            description: "The user the variable belongs to, taken from the context when omitted",
            type: ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, id]) {
        await deleteVariable("user", variableKey(ctx, "user", id), name);
        return this.success();
    }
});
