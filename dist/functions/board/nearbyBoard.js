"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$nearbyBoard",
    description: "Shows the count of competitors before and after the entity in the leaderboard",
    version: "3.0.0",
    output: forgescript_1.ArgType.Json,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "variable",
            description: "Source environment variable name",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "entity",
            description: "Entity identifier",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [variable, entity]) {
        const json = ctx.getEnvironmentKey(variable);
        if (!entity) {
            if (json.type === null)
                return this.successJSON([0, 0]);
            entity = ctx[json.type]?.id;
        }
        let index = -1;
        for (let i = 0, l = json.items.length; i < l; i++) {
            if (json.items[i].key === entity) {
                index = i;
                break;
            }
        }
        if (index === -1)
            return this.successJSON([0, 0]);
        const after = json.items.length - index - 1;
        return this.successJSON([index, after]);
    }
});
//# sourceMappingURL=nearbyBoard.js.map