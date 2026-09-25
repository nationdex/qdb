"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
exports.default = new forgescript_1.NativeFunction({
    name: "$positionBoard",
    description: "Returns the position of the specified entity in the ranked list",
    version: "3.0.0",
    output: forgescript_1.ArgType.Number,
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
                return this.success(0);
            entity = ctx[json.type]?.id;
        }
        let index = -1;
        for (let i = 0, l = json.items.length; i < l; i++) {
            if (json.items[i].key === entity) {
                index = i;
                break;
            }
        }
        return this.success(index + 1);
    }
});
//# sourceMappingURL=positionBoard.js.map