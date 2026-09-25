import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { autoKey, hold } from "../../db";

export default new NativeFunction({
    name: "$hold",
    description: "Applies a hold timer to prevent repeated actions",
    version: "3.0.0",
    brackets: true,
    unwrap: false,
    args: [
        {
            name: "variable",
            description: "Environment variable name",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "type",
            description: "Data type",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "name",
            description: "Hold name",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "duration",
            description: "Hold duration",
            type: ArgType.Time,
            required: true,
            rest: false
        },
        {
            name: "code",
            description: "Code to execute",
            type: ArgType.String,
            rest: false
        },
        {
            name: "key",
            description: "Record key",
            type: ArgType.String,
            rest: false
        }
    ],
    async execute(ctx) {
        // resolveUnhandledArg / isValidReturnType / resolveCode are internal
        // CompiledFunction members marked `private` in forgescript's typings,
        // but are the documented way native functions reach into raw args.
        const self = this as any;
        const variable = await self.resolveUnhandledArg(ctx, 0);
        if (!self.isValidReturnType(variable)) return variable;
        const type = await self.resolveUnhandledArg(ctx, 1);
        if (!self.isValidReturnType(type)) return type;
        const name = await self.resolveUnhandledArg(ctx, 2);
        if (!self.isValidReturnType(name)) return name;
        const duration = await self.resolveUnhandledArg(ctx, 3);
        if (!self.isValidReturnType(duration)) return duration;
        const key = await self.resolveUnhandledArg(ctx, 5);
        if (!self.isValidReturnType(key)) return key;
        const data = await hold(type.value, key.value || autoKey(ctx, type.value), ctx.getEnvironmentKey(variable.value), name.value, duration.value);
        if (!data) {
            const field = this.data.fields![4];
            if (field) {
                const code = await self.resolveCode(ctx, field);
                if (!self.isValidReturnType(code)) return code;
                ctx.container!.content = code.value;
                await ctx.container!.send(ctx.obj);
            }
            return this.stop();
        }
        ctx.setEnvironmentKey(variable.value, data);
        return this.success();
    }
});
