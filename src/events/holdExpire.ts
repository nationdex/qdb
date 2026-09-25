import { Interpreter } from "@tryforge/forgescript";
import { EventHandler } from "../managers/eventHandler";
import { QuorielDB } from "../main";

export default new EventHandler({
    name: "holdExpire",
    description: "Triggered when a hold expires in the database (extracting data from type/key/name/value environment variables)",
    version: "3.0.0",
    listener(environment) {
        const commands = this.getExtension(QuorielDB, true).commands.get("holdExpire");
        if (commands) {
            for (const command of commands) {
                Interpreter.run({ obj: {}, client: this, command, data: command.compiled.code, environment: environment as unknown as Record<string, unknown> });
            }
        }
    }
});
