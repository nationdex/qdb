import { Interpreter } from "@tryforge/forgescript";
import { EventHandler } from "../managers/eventHandler";
import { QuorielDB } from "../main";

export default new EventHandler({
    name: "databaseConnect",
    description: "Called when QuorielDB connects to ForgeScript",
    version: "2.0.0",
    listener() {
        const commands = this.getExtension(QuorielDB, true).commands.get("databaseConnect");
        if (commands) {
            for (const command of commands) {
                Interpreter.run({ obj: {}, client: this, command, data: command.compiled.code });
            }
        }
    }
});
