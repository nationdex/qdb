import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { getVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$getMessageVar",
    description: "Retrieves the value of a variable stored for a message",
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
            name: "message ID",
            description: "The message the variable belongs to, taken from the context when omitted",
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
        return this.successJSON(getVariable("message", variableKey(ctx, "message", id), name, fallback));
    }
});
