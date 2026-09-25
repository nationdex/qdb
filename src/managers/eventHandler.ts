import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { QuorielDB } from "../main";
import type { DatabaseEvents, EventName } from "../types";

export class EventHandler<T extends EventName = EventName> extends BaseEventHandler<DatabaseEvents, T> {
    register(client: ForgeClient): void {
        client.getExtension(QuorielDB, true)["emitter"].on(this.name, this.listener.bind(client) as any);
    }
}
