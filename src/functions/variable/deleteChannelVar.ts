import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { deleteVariable, variableKey } from "../../db";

export default defineFunction({
    name: "$deleteChannelVar",
    description: "Removes a variable stored for a channel",
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
            name: "channel ID",
            description: "The channel the variable belongs to, taken from the context when omitted",
            type: ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [name, id]) {
        await deleteVariable("channel", variableKey(ctx, "channel", id), name);
        return this.success();
    }
});
