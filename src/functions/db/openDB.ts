import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { openDB } from "../../db";

export default new NativeFunction({
    name: "$openDB",
    description: "Opens a connection to one or more databases",
    version: "3.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "types",
            description: "Data type(s)",
            type: ArgType.String,
            required: true,
            rest: true
        }
    ],
    execute(ctx, [array]) {
        openDB(array);
        return this.success();
    }
});
