import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { wipeDB } from "../../db";

export default new NativeFunction({
    name: "$wipeDB",
    description: "Deletes one or more databases",
    version: "2.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type(s)",
            type: ArgType.String,
            required: true,
            rest: true
        }
    ],
    async execute(ctx, [array]) {
        await wipeDB(array);
        return this.success();
    }
});
