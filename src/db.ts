import { mkdir, writeFile, readFile, rm, access, cp, readdir } from "fs/promises";
import { Logger, Context } from "@tryforge/forgescript";
import { performance } from "perf_hooks";
import { join } from "path";
import { open, RootDatabase } from "lmdb";
import type { Emitter } from "@eolthar/events";
import { DatabaseError } from "./errors";
import type {
    Board,
    Config,
    DatabaseEvents,
    DatabaseFlags,
    EntityType,
    RangeEntry,
    RecordData,
    SearchEntry,
    SortingType,
    TypeSchema,
    ValueType
} from "./types";

interface ForgeClientLike {
    db: { getAll(): Promise<TransferItem[]> };
}

interface TransferItem {
    type: string;
    id: string;
    guildId?: string;
    name: string;
    value: string;
}

let emitter: Emitter<DatabaseEvents> | null = null;

const databases = new Map<string, RootDatabase<RecordData, string>>();
const types = new Map<string, TypeSchema>();
const config: Config = {
    path: join(process.cwd(), "database"),
    separator: "~",
    flags: {},
    events: {
        databaseConnect: false,
        recordUpdate: false,
        recordRemove: false,
        holdExpire: false
    }
};

const locked = ["path", "name", "dupSort", "useVersions", "maxDbs", "readOnly", "noSubdir"];
const entities: EntityType[] = ["user", "member", "guild", "channel", "role", "message"];

const safeName = /^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/;
const registered = new Map<string, TypeSchema>();
// setTimeout overflows (and fires immediately) past 2^31-1 ms
const MAX_TIMEOUT = 2 ** 31 - 1;

function assertName(type: string): void {
    if (typeof type !== "string" || !safeName.test(type) || type === "." || type === "..") {
        throw new DatabaseError(`Invalid database type name "${type}"`);
    }
}

function getDB(type: string): RootDatabase<RecordData, string> {
    const db = databases.get(type);
    if (!db) {
        throw new DatabaseError(types.has(type) ? `Database "${type}" is not open` : `Unknown database type "${type}"`);
    }
    return db;
}

function getSchema(type: string): TypeSchema {
    const schema = types.get(type);
    if (!schema) throw new DatabaseError(`Unknown database type "${type}"`);
    return schema;
}

function edgeApi(): { features: ReadonlySet<string>; resolveDefault: (value: any, ...path: string[]) => any } | undefined {
    return (globalThis as any)[Symbol.for("quoriel.edge")];
}

function filterFlags(source: Record<string, any>): DatabaseFlags {
    const clean: Record<string, any> = {};
    for (const key in source) {
        if (!locked.includes(key)) clean[key] = source[key];
    }
    return clean;
}

function isValidSchema(schema: any): schema is TypeSchema {
    if (typeof schema !== "object" || schema === null) return false;
    if (schema.type !== null && !entities.includes(schema.type)) return false;
    if (typeof schema.guild !== "boolean") return false;
    return true;
}

/**
 * Initializes the database folder and, when the QuorielEdge `structureDefaults`
 * feature is available, wires `valueRecord` to fall back on it.
 */
export async function initDB(path?: string): Promise<void> {
    if (path) config.path = join(process.cwd(), path);
    await reloadDB();
}

/**
 * Registers the emitter used to dispatch enabled events, and marks each
 * requested event as active.
 */
export function setupEvents(secret: Emitter<DatabaseEvents>, events: string[]): void {
    emitter = secret;
    for (const name of events) (config.events as Record<string, boolean>)[name] = true;
    emitter.emit("databaseConnect");
}

/**
 * Reloads `config.json` from the database folder.
 */
export async function reloadDB(): Promise<void> {
    await mkdir(config.path, { recursive: true });
    const content = await readFile(join(__dirname, "config.json"), "utf8");
    const full = join(config.path, "config.json");
    try {
        await writeFile(full, content, { flag: "wx", encoding: "utf8" });
    } catch (error: any) {
        if (error.code !== "EEXIST") return;
    }
    try {
        const data = JSON.parse(await readFile(full, "utf8"));
        if (data.separator) {
            config.separator = data.separator;
        }
        if (data.flags) {
            for (const key in config.flags) delete (config.flags as Record<string, any>)[key];
            Object.assign(config.flags, filterFlags(data.flags));
        }
        if (data.types) {
            types.clear();
            for (const key in data.types) {
                if (isValidSchema(data.types[key])) types.set(key, data.types[key]);
            }
            for (const [key, schema] of registered) if (!types.has(key)) types.set(key, schema);
        }
    } catch (error) {
        Logger.error(error as any);
    }
}

/**
 * Closes the given databases.
 */
export async function closeDB(array: string[]): Promise<void> {
    for (const type of array) {
        const db = databases.get(type);
        if (!db) continue;
        databases.delete(type);
        await db.close();
    }
}

/**
 * Closes the given databases and deletes their files.
 */
export async function wipeDB(array: string[]): Promise<void> {
    for (const type of array) assertName(type);
    await closeDB(array);
    for (const type of array) {
        await rm(join(config.path, "types", type), { recursive: true, force: true });
    }
}

function scheduleHoldExpire(db: RootDatabase<RecordData, string>, type: string, key: string, name: string, value: number): void {
    const wait = value - Date.now();
    const timer = setTimeout(() => {
        if (wait > MAX_TIMEOUT) return scheduleHoldExpire(db, type, key, name, value);
        if (databases.get(type) === db && db.get(key)?.holds?.[name] === value) emitter!.emit("holdExpire", { type, key, name, value });
    }, Math.min(Math.max(wait, 0), MAX_TIMEOUT));
    timer.unref();
}

function openDatabase(type: string, flags: DatabaseFlags = {}): RootDatabase<RecordData, string> {
    const db = open<RecordData, string>({
        ...config.flags,
        ...flags,
        useVersions: false,
        dupSort: false,
        path: join(config.path, "types", type)
    });
    databases.set(type, db);
    if (config.events.holdExpire) {
        for (const item of db.getRange({ snapshot: false })) {
            const value = item.value.holds;
            if (!value) continue;
            for (const name in value) {
                scheduleHoldExpire(db, type, item.key, name, value[name]);
            }
        }
    }
    return db;
}

/**
 * Opens the given databases, skipping unknown and already open ones.
 */
export function openDB(array: string[]): void {
    for (const type of array) {
        if (types.has(type) && !databases.has(type)) {
            openDatabase(type);
        }
    }
}

/**
 * Declares a type and opens its database. Returns the handle, or `false` when
 * the schema is invalid. An existing type is returned untouched.
 */
export function registerDB(name: string, schema: TypeSchema, flags: DatabaseFlags = {}): RootDatabase<RecordData, string> | false {
    if (!types.has(name)) {
        if (!isValidSchema(schema)) return false;
        assertName(name);
        types.set(name, schema);
        registered.set(name, schema);
    }
    let db = databases.get(name);
    if (!db) {
        db = openDatabase(name, filterFlags(flags));
    }
    return db;
}

/**
 * Round-trip time of a single read, in milliseconds.
 */
export function pingDB(type: string): number {
    const start = performance.now();
    getDB(type).get("ping");
    return Math.round(performance.now() - start);
}

/**
 * Names of the currently open databases.
 */
export function activeDB(): string[] {
    return [...databases.keys()];
}

/**
 * Loads the given keys into memory.
 */
export async function prefetchDB(type: string, keys: string[]): Promise<void> {
    await getDB(type).prefetch(keys);
}

/**
 * Every record of a database.
 */
export function rangeDB(type: string): RangeEntry[] {
    const result: RangeEntry[] = [];
    for (const item of getDB(type).getRange({ snapshot: false })) result.push(item);
    return result;
}

/**
 * Every key of a database.
 */
export function keysDB(type: string): string[] {
    const result: string[] = [];
    for (const key of getDB(type).getKeys({ snapshot: false })) result.push(key);
    return result;
}

/**
 * Searches records by any combination of filters. Omitting `type` searches
 * every open database.
 */
export function searchDB(
    type?: string | null,
    name?: string | null,
    valueType?: ValueType | null,
    value?: string | null,
    entity?: string | null,
    guild?: string | null
): SearchEntry[] {
    const nof = !name && !valueType && !value;
    const sep = config.separator;
    const res: SearchEntry[] = [];
    if (type) {
        processSearch(type, getDB(type), nof, res, sep, name, valueType, value, entity, guild);
    } else {
        for (const ent of databases) {
            processSearch(ent[0], ent[1], nof, res, sep, name, valueType, value, entity, guild);
        }
    }
    return res;
}

function processSearch(
    type: string,
    db: RootDatabase<RecordData, string>,
    nof: boolean,
    res: SearchEntry[],
    sep: string,
    name?: string | null,
    valueType?: ValueType | null,
    value?: string | null,
    entity?: string | null,
    guild?: string | null
): void {
    const is = getSchema(type).guild;
    if (guild && !is) return;
    for (const item of db.getRange({ snapshot: false })) {
        const key = item.key;
        const val = item.value;
        if (is) {
            const pos = key.indexOf(sep);
            if (entity && key.substring(0, pos) !== entity) continue;
            if (guild && key.substring(pos + 1) !== guild) continue;
        } else {
            if (entity && key !== entity) continue;
        }
        if (nof) {
            res.push({ type, key, value: val });
            continue;
        }
        const fil: RecordData = {};
        let hit = false;
        if (name) {
            if (!(name in val)) continue;
            const pv = val[name];
            if (valueType && typeDefinition(pv) !== valueType) continue;
            if (value && pv !== value) continue;
            fil[name] = pv;
            hit = true;
        } else {
            for (const prop in val) {
                const pv = val[prop];
                if (valueType && typeDefinition(pv) !== valueType) continue;
                if (value && pv !== value) continue;
                fil[prop] = pv;
                hit = true;
            }
        }
        if (!hit) continue;
        res.push({ type, key, value: fil });
    }
}

function typeDefinition(value: any): ValueType {
    if (Array.isArray(value)) return "array";
    const t = typeof value;
    if (t !== "string") return t as ValueType;
    const trimmed = value.trim();
    return trimmed && !isNaN(+trimmed) ? "number" : "string";
}

/**
 * Builds a record key, taking the entity from the context when it is omitted.
 */
export function makeKey(ctx: Context, type: string, entity?: string | null, guild?: string | null): string {
    const view = getSchema(type);
    if (!entity) entity = view.type ? (ctx as any)[view.type]?.id : undefined;
    if (!entity) throw new DatabaseError(`Cannot resolve the "${type}" key: no entity given and none in this context`);
    if (view.guild) {
        const id = guild ?? ctx.guild?.id;
        if (!id) throw new DatabaseError(`Cannot resolve the "${type}" key: no guild given and none in this context`);
        return entity + config.separator + id;
    }
    return entity;
}

/**
 * Joins an entity and a guild into a record key, without touching the context.
 */
export function formatKey(type: string, entity: string, guild?: string): string {
    if (getSchema(type).guild) return entity + config.separator + guild;
    return entity;
}

/**
 * Builds a record key entirely from the context.
 */
export function autoKey(ctx: Context, type: string): string {
    return makeKey(ctx, type);
}

/**
 * Applies a hold, returning the updated record or `null` when the hold is
 * already active.
 */
export async function hold(type: string, key: string, data: RecordData | undefined, name: string, duration: number): Promise<RecordData | null> {
    const now = Date.now();
    if (data?.holds?.[name] > now) return null;
    const value = now + duration;
    const next = { ...data, holds: { ...data?.holds, [name]: value } };
    const db = getDB(type);
    await writeRecord(db, type, key, next);
    if (config.events.holdExpire) scheduleHoldExpire(db, type, key, name, value);
    return next;
}

/**
 * Single field of a record, falling back to the structure default when the
 * `structureDefaults` feature of QuorielEdge is enabled.
 */
export function valueRecord(type: string, key: string, name: string): any {
    const value = getDB(type).get(key)?.[name];
    const copy = value !== null && typeof value === "object" ? (Array.isArray(value) ? [...value] : { ...value }) : value;
    const edge = edgeApi();
    return edge?.features.has("structureDefaults") ? edge.resolveDefault(copy, type, name) : copy;
}

/**
 * Whether a key is stored.
 */
export function existsRecord(type: string, key: string): boolean {
    // doesExist keeps answering true for removed keys when the `cache` flag is on
    return getDB(type).get(key) !== undefined;
}

/**
 * `getRecord` against an already resolved handle.
 */
export function readRecord(db: RootDatabase<RecordData, string>, type: string, key: string): RecordData {
    return { ...db.get(key) };
}

/**
 * Copy of a record, empty when it is not stored.
 */
export function getRecord(type: string, key: string): RecordData {
    return readRecord(getDB(type), type, key);
}

/**
 * `removeRecord` against an already resolved handle. Resolves to the LMDB
 * result when `recordRemove` is disabled.
 */
export async function deleteRecord(db: RootDatabase<RecordData, string>, type: string, key: string): Promise<boolean | void> {
    if (!config.events.recordRemove) return db.remove(key);
    const value = db.get(key);
    if (value !== undefined) {
        await db.remove(key);
        emitter!.emit("recordRemove", { type, key, value: { ...value } });
    }
}

/**
 * Deletes a record. Emits `recordRemove` when enabled.
 */
export async function removeRecord(type: string, key: string): Promise<void> {
    await deleteRecord(getDB(type), type, key);
}

/**
 * `putRecord` against an already resolved handle, without the empty-object and
 * shape checks. Resolves to the LMDB result when `recordUpdate` is disabled.
 */
export async function writeRecord(db: RootDatabase<RecordData, string>, type: string, key: string, data: RecordData): Promise<boolean | void> {
    const stored = { ...data };
    if (!config.events.recordUpdate) return db.put(key, stored);
    const old = db.get(key);
    await db.put(key, stored);
    emitter!.emit("recordUpdate", {
        type,
        key,
        value: {
            old: old !== undefined ? { ...old } : undefined,
            new: stored
        }
    });
}

/**
 * Stores a record, deleting the key when `data` is empty. Returns `false` when
 * `data` is not a plain object.
 */
export async function putRecord(type: string, key: string, data: RecordData | undefined): Promise<boolean> {
    if (typeof data !== "object" || data === null || Array.isArray(data)) return false;
    const db = getDB(type);
    if (Object.keys(data).length) {
        await writeRecord(db, type, key, data);
    } else {
        await deleteRecord(db, type, key);
    }
    return true;
}

const unsafeFields = new Set(["__proto__", "constructor", "prototype"]);

// ForgeDB stored every value as text; keep numbers, booleans and JSON as real values when they read back identically.
function parseValue(raw: string): unknown {
    const text = raw.trim();
    if (!text) return raw;
    try {
        const parsed = JSON.parse(text);
        if (parsed !== null && typeof parsed === "object") return parsed;
        if (String(parsed) === raw && typeof parsed !== "string") return parsed;
    } catch {
        // plain text
    }
    return raw;
}

function ensureOpen(type: string): RootDatabase<RecordData, string> {
    const db = databases.get(type);
    if (db) return db;
    getSchema(type);
    return openDatabase(type);
}

/**
 * Key of a record for the ForgeDB-style variable functions. `global` always
 * uses the `custom` record, the same one `transferDatabase` fills.
 */
export function variableKey(ctx: Context, type: string, id?: string | null, guild?: string | null): string {
    if (type === "global") return "custom";
    return makeKey(ctx, type, id, guild);
}

function checkField(name: string): void {
    if (!name || unsafeFields.has(name)) throw new DatabaseError(`Invalid variable name "${name}"`);
}

/**
 * Reads a single variable of a record, opening the database on first use.
 * Falls back to the QuorielEdge structure default, then to `fallback`.
 */
export function getVariable(type: string, key: string, name: string, fallback?: string | null): any {
    checkField(name);
    ensureOpen(type);
    const value = valueRecord(type, key, name);
    return value === undefined || value === null ? (fallback ?? "") : value;
}

/**
 * Stores a single variable of a record. Text that is a number, boolean or
 * JSON is stored as that value, anything else stays a string.
 */
export async function setVariable(type: string, key: string, name: string, value: string): Promise<void> {
    checkField(name);
    const db = ensureOpen(type);
    await writeRecord(db, type, key, { ...db.get(key), [name]: parseValue(value) });
}

/**
 * Removes a single variable, deleting the record once it is empty.
 */
export async function deleteVariable(type: string, key: string, name: string): Promise<void> {
    checkField(name);
    const db = ensureOpen(type);
    const record = db.get(key);
    if (record === undefined || !(name in record)) return;
    const { [name]: _removed, ...rest } = record;
    if (Object.keys(rest).length) await writeRecord(db, type, key, rest);
    else await deleteRecord(db, type, key);
}

/**
 * Moves a record to another key, deleting the source unless `deleteSource` is
 * `false`. Returns `false` when the source is not stored.
 */
export async function moveRecord(type: string, fromKey: string, toKey: string, deleteSource?: boolean | null): Promise<boolean> {
    const db = getDB(type);
    const original = db.get(fromKey);
    if (original === undefined) return false;
    await writeRecord(db, type, toKey, original);
    if (deleteSource !== false) await deleteRecord(db, type, fromKey);
    return true;
}

/**
 * Ranks records by a numeric field. Guild types keep only the given guild.
 */
export function leaderBoard(type: string, name: string, sorting?: SortingType | null, guild?: string | null): Board {
    const is = getSchema(type).guild;
    const items: { key: string; value: number; position?: number }[] = [];
    for (const item of getDB(type).getRange({ snapshot: false })) {
        const key = item.key;
        const parts = key.indexOf(config.separator);
        if (!is || key.substring(parts + 1) === guild) {
            const value = Number(item.value[name]);
            if (!isNaN(value)) {
                items.push({ key: is ? key.substring(0, parts) : key, value });
            }
        }
    }
    items.sort((a, b) => (sorting === "asc" ? a.value - b.value : b.value - a.value));
    for (let i = 0, l = items.length; i < l; i++) items[i].position = i + 1;
    return { type: getSchema(type).type, items: items as Board["items"], count: items.length };
}

/**
 * Replaces the backup of a type with a fresh one.
 */
export async function createBackup(type: string): Promise<void> {
    assertName(type);
    const db = getDB(type);
    const full = join(config.path, "backups", type);
    await rm(full, { recursive: true, force: true });
    await mkdir(full, { recursive: true });
    await db.backup(full, false);
}

/**
 * Deletes the backup of a type.
 */
export async function removeBackup(type: string): Promise<void> {
    assertName(type);
    await rm(join(config.path, "backups", type), { recursive: true, force: true });
}

/**
 * Restores a type from its backup. Returns `false` when the database is
 * already present or open, or when there is no backup.
 */
export async function restoreBackup(type: string): Promise<boolean> {
    assertName(type);
    if (!types.has(type) || databases.has(type)) return false;
    const db = join(config.path, "types", type);
    try {
        await access(db);
        return false;
    } catch {
        // it just works ¯\_(ツ)_/¯
    }
    const backup = join(config.path, "backups", type);
    try {
        await access(backup);
    } catch {
        return false;
    }
    await cp(backup, db, { recursive: true });
    return true;
}

/**
 * Copies data from ForgeDB, waiting for it to be ready. `rewrite` controls
 * whether existing fields are overwritten.
 */
export async function transferDatabase(client: ForgeClientLike, rewrite = false): Promise<void> {
    Logger.info("[QuorielDB] The transfer code will run as soon as ForgeDB is initialized!");
    let items: TransferItem[];
    while (true) {
        try {
            items = await client.db.getAll();
            break;
        } catch {
            Logger.info("[QuorielDB] Waiting for ForgeDB to be ready, retrying in 5 seconds...");
            await wait(5000);
        }
    }
    Logger.info("[QuorielDB] The data transfer code has been started.");
    for (const item of items) {
        if (item.type !== "old") {
            const type = item.type.replace("custom", "global");
            if (!databases.has(type)) {
                openDB([type]);
                await wait(2000);
            }
            let key: string;
            if (type === "global") {
                key = "custom";
            } else if (type === "user" || type === "guild") {
                key = item.id;
            } else {
                key = formatKey(type, item.id, item.guildId);
            }
            let value: any;
            try {
                value = JSON.parse(item.value);
            } catch {
                value = item.value;
            }
            const db = getDB(type);
            const original = db.get(key);
            const data: RecordData = { ...original };
            if (rewrite || !data.hasOwnProperty(item.name)) {
                data[item.name] = value;
                await db.put(key, data);
            }
        }
    }
    Logger.info("[QuorielDB] Data transfer completed!");
}

/**
 * Rebuilds every database with the given flags. Requires exclusive access.
 */
export async function migrationDatabases(options?: DatabaseFlags): Promise<void> {
    Logger.info("[QuorielDB] Migration started - tools aligned, buffers cleared, engines humming.");
    const migrationPath = join(config.path, "migration");
    const typesMigrate = await readdir(join(config.path, "types"));
    const oldFlags = options || {
        noReadAhead: true,
        noMemInit: true,
        cache: true
    };
    await cp(join(config.path, "types"), migrationPath, { recursive: true });
    for (const type of typesMigrate) {
        await rm(join(config.path, "types", type), { recursive: true, force: true });
        const oldDB = open<RecordData, string>({
            ...oldFlags,
            path: join(migrationPath, type)
        });
        const newDB = open<RecordData, string>({
            ...config.flags,
            useVersions: false,
            dupSort: false,
            path: join(config.path, "types", type)
        });
        for (const item of oldDB.getRange({ snapshot: false })) {
            await newDB.put(item.key, item.value);
        }
        await oldDB.close();
        await newDB.close();
    }
    await rm(migrationPath, { recursive: true, force: true });
    Logger.info(`[QuorielDB] Migration complete! Types updated (${typesMigrate.join(", ")})`);
}

async function wait(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

export { types, config };
