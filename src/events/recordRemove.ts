import { Interpreter } from "@tryforge/forgescript";
import { EventHandler } from "../managers/eventHandler";
import { QuorielDB } from "../main";

export default new EventHandler({
    name: "recordRemove",
    description: "Triggered when an entity record is deleted from the database (extracting data from type/key/value environment variables)",
    version: "1.4.1",
    listener(environment) {
        const commands = this.getExtension(QuorielDB, true).commands.get("recordRemove");
        if (commands) {
            for (const command of commands) {
                Interpreter.run({ obj: {}, client: this, command, data: command.compiled.code, environment: environment as unknown as Record<string, unknown> });
            }
        }
    }
});
