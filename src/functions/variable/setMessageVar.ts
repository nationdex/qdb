import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { setVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$setMessageVar",
    description: "Assigns a value to a variable stored for a message",
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
            name: "message ID",
            description: "The message the variable belongs to, taken from the context when omitted",
            type: ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, value, id]) {
        await setVariable("message", variableKey(ctx, "message", id), name, value);
        return this.success();
    }
});
