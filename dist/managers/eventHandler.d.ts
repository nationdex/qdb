import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import type { DatabaseEvents, EventName } from "../types";
export declare class EventHandler<T extends EventName = EventName> extends BaseEventHandler<DatabaseEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=eventHandler.d.ts.map