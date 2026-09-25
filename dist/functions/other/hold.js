"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const db_1 = require("../../db");
exports.default = new forgescript_1.NativeFunction({
    name: "$hold",
    description: "Applies a hold timer to prevent repeated actions",
    version: "3.0.0",
    brackets: true,
    unwrap: false,
    args: [
        {
            name: "variable",
            description: "Environment variable name",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "type",
            description: "Data type",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "name",
            description: "Hold name",
            type: forgescript_1.ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "duration",
            description: "Hold duration",
            type: forgescript_1.ArgType.Time,
            required: true,
            rest: false
        },
        {
            name: "code",
            description: "Code to execute",
            type: forgescript_1.ArgType.String,
            rest: false
        },
        {
            name: "key",
            description: "Record key",
            type: forgescript_1.ArgType.String,
            rest: false
        }
    ],
    async execute(ctx) {
        // resolveUnhandledArg / isValidReturnType / resolveCode are internal
        // CompiledFunction members marked `private` in forgescript's typings,
        // but are the documented way native functions reach into raw args.
        const self = this;
        const variable = await self.resolveUnhandledArg(ctx, 0);
        if (!self.isValidReturnType(variable))
            return variable;
        const type = await self.resolveUnhandledArg(ctx, 1);
        if (!self.isValidReturnType(type))
            return type;
        const name = await self.resolveUnhandledArg(ctx, 2);
        if (!self.isValidReturnType(name))
            return name;
        const duration = await self.resolveUnhandledArg(ctx, 3);
        if (!self.isValidReturnType(duration))
            return duration;
        const key = await self.resolveUnhandledArg(ctx, 5);
        if (!self.isValidReturnType(key))
            return key;
        const data = await (0, db_1.hold)(type.value, key.value || (0, db_1.autoKey)(ctx, type.value), ctx.getEnvironmentKey(variable.value), name.value, duration.value);
        if (!data) {
            const field = this.data.fields[4];
            if (field) {
                const code = await self.resolveCode(ctx, field);
                if (!self.isValidReturnType(code))
                    return code;
                ctx.container.content = code.value;
                await ctx.container.send(ctx.obj);
            }
            return this.stop();
        }
        ctx.setEnvironmentKey(variable.value, data);
        return this.success();
    }
});
//# sourceMappingURL=hold.js.map