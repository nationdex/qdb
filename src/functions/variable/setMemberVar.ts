import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { setVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$setMemberVar",
    description: "Assigns a value to a variable stored for a member",
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
        }
    ],
    async execute(ctx, [name, value, id0, id1]) {
        await setVariable("member", variableKey(ctx, "member", id0, id1), name, value);
        return this.success();
    }
});
