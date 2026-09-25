import { ForgeExtension, ForgeClient } from "@tryforge/forgescript";
import { Emitter } from "@eolthar/events";
import { CommandManager } from "./managers/commandManager";
import * as db from "./db";
import type { DatabaseEvents, QuorielDBOptions } from "./types";
/**
 * ForgeScript extension exposing LMDB-backed storage.
 */
export declare class QuorielDB extends ForgeExtension {
    name: string;
    description: string;
    version: string;
    /**
     * Emitter the registered events are dispatched on.
     */
    emitter: Emitter<DatabaseEvents>;
    /**
     * Loads a folder of event modules. Assigned during `init`.
     */
    commands: CommandManager;
    options?: QuorielDBOptions;
    constructor(options?: QuorielDBOptions);
    init(client: ForgeClient): Promise<void>;
}
export declare const hold: typeof db.hold, makeKey: typeof db.makeKey, formatKey: typeof db.formatKey, autoKey: typeof db.autoKey, migrationDatabases: typeof db.migrationDatabases, transferDatabase: typeof db.transferDatabase, leaderBoard: typeof db.leaderBoard, activeDB: typeof db.activeDB, closeDB: typeof db.closeDB, keysDB: typeof db.keysDB, openDB: typeof db.openDB, pingDB: typeof db.pingDB, wipeDB: typeof db.wipeDB, rangeDB: typeof db.rangeDB, reloadDB: typeof db.reloadDB, searchDB: typeof db.searchDB, registerDB: typeof db.registerDB, prefetchDB: typeof db.prefetchDB, getRecord: typeof db.getRecord, readRecord: typeof db.readRecord, valueRecord: typeof db.valueRecord, existsRecord: typeof db.existsRecord, deleteRecord: typeof db.deleteRecord, removeRecord: typeof db.removeRecord, writeRecord: typeof db.writeRecord, moveRecord: typeof db.moveRecord, putRecord: typeof db.putRecord, createBackup: typeof db.createBackup, removeBackup: typeof db.removeBackup, restoreBackup: typeof db.restoreBackup, types: Map<string, import("./types").TypeSchema>, config: import("./types").Config;
//# sourceMappingURL=main.d.ts.map