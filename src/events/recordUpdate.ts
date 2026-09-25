import { Interpreter } from "@tryforge/forgescript";
import { EventHandler } from "../managers/eventHandler";
import { QuorielDB } from "../main";

export default new EventHandler({
    name: "recordUpdate",
    description: "Triggered when entity data is updated (extracting data from type/key/value environment variables)",
    version: "2.2.0",
    listener(environment) {
        const commands = this.getExtension(QuorielDB, true).commands.get("recordUpdate");
        if (commands) {
            for (const command of commands) {
                Interpreter.run({ obj: {}, client: this, command, data: command.compiled.code, environment: environment as unknown as Record<string, unknown> });
            }
        }
    }
});
