import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { getVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$getMemberVar",
    description: "Retrieves the value of a variable stored for a member",
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
            name: "member ID",
            description: "The member the variable belongs to, taken from the context when omitted",
            type: ArgType.String,
            rest: false
        },
        {
            name: "guild ID",
            description: "The guild the variable belongs to, taken from the context when omitted",
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
    execute(ctx, [name, id0, id1, fallback]) {
        return this.successJSON(getVariable("member", variableKey(ctx, "member", id0, id1), name, fallback));
    }
});
