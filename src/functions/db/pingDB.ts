import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { pingDB } from "../../db";

export default new NativeFunction({
    name: "$pingDB",
    description: "Checks the database response time",
    version: "2.0.0",
    output: ArgType.Number,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "type",
            description: "Data type",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    execute(ctx, [type]) {
        return this.success(pingDB(type));
    }
});
