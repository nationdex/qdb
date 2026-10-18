import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { deleteVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$deleteGuildVar",
    aliases: ["$deleteServerVar"],
    description: "Removes a variable stored for a guild",
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
            name: "guild ID",
            description: "The guild the variable belongs to, taken from the context when omitted",
            type: ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, id]) {
        await deleteVariable("guild", variableKey(ctx, "guild", id), name);
        return this.success();
    }
});
