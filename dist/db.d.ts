import { Context } from "@tryforge/forgescript";
import { RootDatabase } from "lmdb";
import type { Emitter } from "@eolthar/events";
import type { Board, Config, DatabaseEvents, DatabaseFlags, RangeEntry, RecordData, SearchEntry, SortingType, TypeSchema, ValueType } from "./types";
interface ForgeClientLike {
    db: {
        getAll(): Promise<TransferItem[]>;
    };
}
interface TransferItem {
    type: string;
    id: string;
    guildId?: string;
    name: string;
    value: string;
}
declare const types: Map<string, TypeSchema>;
declare const config: Config;
/**
 * Initializes the database folder and, when the QuorielEdge `structureDefaults`
 * feature is available, wires `valueRecord` to fall back on it.
 */
export declare function initDB(path?: string): Promise<void>;
/**
 * Registers the emitter used to dispatch enabled events, and marks each
 * requested event as active.
 */
export declare function setupEvents(secret: Emitter<DatabaseEvents>, events: string[]): void;
/**
 * Reloads `config.json` from the database folder.
 */
export declare function reloadDB(): Promise<void>;
/**
 * Closes the given databases.
 */
export declare function closeDB(array: string[]): Promise<void>;
/**
 * Closes the given databases and deletes their files.
 */
export declare function wipeDB(array: string[]): Promise<void>;
/**
 * Opens the given databases, skipping unknown and already open ones.
 */
export declare function openDB(array: string[]): void;
/**
 * Declares a type and opens its database. Returns the handle, or `false` when
 * the schema is invalid. An existing type is returned untouched.
 */
export declare function registerDB(name: string, schema: TypeSchema, flags?: DatabaseFlags): RootDatabase<RecordData, string> | false;
/**
 * Round-trip time of a single read, in milliseconds.
 */
export declare function pingDB(type: string): number;
/**
 * Names of the currently open databases.
 */
export declare function activeDB(): string[];
/**
 * Loads the given keys into memory.
 */
export declare function prefetchDB(type: string, keys: string[]): Promise<void>;
/**
 * Every record of a database.
 */
export declare function rangeDB(type: string): RangeEntry[];
/**
 * Every key of a database.
 */
export declare function keysDB(type: string): string[];
/**
 * Searches records by any combination of filters. Omitting `type` searches
 * every open database.
 */
export declare function searchDB(type?: string | null, name?: string | null, valueType?: ValueType | null, value?: string | null, entity?: string | null, guild?: string | null): SearchEntry[];
/**
 * Builds a record key, taking the entity from the context when it is omitted.
 */
export declare function makeKey(ctx: Context, type: string, entity?: string | null, guild?: string | null): string;
/**
 * Joins an entity and a guild into a record key, without touching the context.
 */
export declare function formatKey(type: string, entity: string, guild?: string): string;
/**
 * Builds a record key entirely from the context.
 */
export declare function autoKey(ctx: Context, type: string): string;
/**
 * Applies a hold, returning the updated record or `null` when the hold is
 * already active.
 */
export declare function hold(type: string, key: string, data: RecordData | undefined, name: string, duration: number): Promise<RecordData | null>;
/**
 * Single field of a record, falling back to the structure default when the
 * `structureDefaults` feature of QuorielEdge is enabled.
 */
export declare function valueRecord(type: string, key: string, name: string): any;
/**
 * Whether a key is stored.
 */
export declare function existsRecord(type: string, key: string): boolean;
/**
 * `getRecord` against an already resolved handle.
 */
export declare function readRecord(db: RootDatabase<RecordData, string>, type: string, key: string): RecordData;
/**
 * Copy of a record, empty when it is not stored.
 */
export declare function getRecord(type: string, key: string): RecordData;
/**
 * `removeRecord` against an already resolved handle. Resolves to the LMDB
 * result when `recordRemove` is disabled.
 */
export declare function deleteRecord(db: RootDatabase<RecordData, string>, type: string, key: string): Promise<boolean | void>;
/**
 * Deletes a record. Emits `recordRemove` when enabled.
 */
export declare function removeRecord(type: string, key: string): Promise<void>;
/**
 * `putRecord` against an already resolved handle, without the empty-object and
 * shape checks. Resolves to the LMDB result when `recordUpdate` is disabled.
 */
export declare function writeRecord(db: RootDatabase<RecordData, string>, type: string, key: string, data: RecordData): Promise<boolean | void>;
/**
 * Stores a record, deleting the key when `data` is empty. Returns `false` when
 * `data` is not a plain object.
 */
export declare function putRecord(type: string, key: string, data: RecordData | undefined): Promise<boolean>;
/**
 * Moves a record to another key, deleting the source unless `deleteSource` is
 * `false`. Returns `false` when the source is not stored.
 */
export declare function moveRecord(type: string, fromKey: string, toKey: string, deleteSource?: boolean | null): Promise<boolean>;
/**
 * Ranks records by a numeric field. Guild types keep only the given guild.
 */
export declare function leaderBoard(type: string, name: string, sorting?: SortingType | null, guild?: string | null): Board;
/**
 * Replaces the backup of a type with a fresh one.
 */
export declare function createBackup(type: string): Promise<void>;
/**
 * Deletes the backup of a type.
 */
export declare function removeBackup(type: string): Promise<void>;
/**
 * Restores a type from its backup. Returns `false` when the database is
 * already present or open, or when there is no backup.
 */
export declare function restoreBackup(type: string): Promise<boolean>;
/**
 * Copies data from ForgeDB, waiting for it to be ready. `rewrite` controls
 * whether existing fields are overwritten.
 */
export declare function transferDatabase(client: ForgeClientLike, rewrite?: boolean): Promise<void>;
/**
 * Rebuilds every database with the given flags. Requires exclusive access.
 */
export declare function migrationDatabases(options?: DatabaseFlags): Promise<void>;
export { types, config };
//# sourceMappingURL=db.d.ts.map