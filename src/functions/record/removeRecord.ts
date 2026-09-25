import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { autoKey, removeRecord } from "../../db";

export default new NativeFunction({
    name: "$removeRecord",
    description: "Deletes the record of the specified key",
    version: "3.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "key",
            description: "Record key",
            type: ArgType.String,
            rest: false
        }
    ],
    async execute(ctx, [type, key]) {
        await removeRecord(type, key || autoKey(ctx, type));
        return this.success();
    }
});
