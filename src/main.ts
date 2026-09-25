import { ForgeExtension, EventManager, ForgeClient } from "@tryforge/forgescript";
import { Emitter } from "@eolthar/events";
import { CommandManager } from "./managers/commandManager";
import * as db from "./db";
import type { DatabaseEvents, QuorielDBOptions } from "./types";

const { description, version } = require("../package.json") as { description: string; version: string };
const { initDB, setupEvents, ...functions } = db;

/**
 * ForgeScript extension exposing LMDB-backed storage.
 */
export class QuorielDB extends ForgeExtension {
    name = "QuorielDB";
    description = description;
    version = version;

    /**
     * Emitter the registered events are dispatched on.
     */
    emitter = new Emitter<DatabaseEvents>();

    /**
     * Loads a folder of event modules. Assigned during `init`.
     */
    commands!: CommandManager;

    options?: QuorielDBOptions;

    constructor(options?: QuorielDBOptions) {
        super();
        this.options = options;
    }

    async init(client: ForgeClient): Promise<void> {
        this.commands = new CommandManager(client);
        this.load(__dirname + "/functions");
        if (this.options?.events?.length) {
            EventManager.load("QuorielDBEvents", __dirname + "/events");
            client.events.load("QuorielDBEvents", this.options.events);
        }
        await initDB(this.options?.path);
        if (this.options?.events?.length) setupEvents(this.emitter, this.options.events);
    }
}

export const {
    hold,
    makeKey,
    formatKey,
    autoKey,

    migrationDatabases,
    transferDatabase,
    leaderBoard,

    activeDB,
    closeDB,
    keysDB,
    openDB,
    pingDB,
    wipeDB,
    rangeDB,
    reloadDB,
    searchDB,
    registerDB,
    prefetchDB,

    getRecord,
    readRecord,
    valueRecord,
    existsRecord,
    deleteRecord,
    removeRecord,
    writeRecord,
    moveRecord,
    putRecord,

    createBackup,
    removeBackup,
    restoreBackup,

    types,
    config
} = functions;
