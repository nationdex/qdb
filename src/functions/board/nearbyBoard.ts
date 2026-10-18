import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";

export default defineFunction({
    name: "$nearbyBoard",
    description: "Shows the count of competitors before and after the entity in the leaderboard",
    version: "3.0.0",
    output: ArgType.Json,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "variable",
            description: "Source environment variable name",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "entity",
            description: "Entity identifier",
            type: ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [variable, entity]) {
        const json: any = ctx.getEnvironmentKey(variable);
        if (!entity) {
            if (json.type === null) return this.successJSON([0, 0]);
            entity = (ctx as any)[json.type]?.id;
        }
        let index = -1;
        for (let i = 0, l = json.items.length; i < l; i++) {
            if (json.items[i].key === entity) {
                index = i;
                break;
            }
        }
        if (index === -1) return this.successJSON([0, 0]);
        const after = json.items.length - index - 1;
        return this.successJSON([index, after]);
    }
});
