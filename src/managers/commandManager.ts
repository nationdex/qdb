import { BaseCommandManager } from "@tryforge/forgescript";
import type { EventName } from "../types";

export class CommandManager extends BaseCommandManager<EventName> {
    handlerName = "QuorielDBEvents";
}
