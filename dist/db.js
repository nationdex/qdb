"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.types = void 0;
exports.initDB = initDB;
exports.setupEvents = setupEvents;
exports.reloadDB = reloadDB;
exports.closeDB = closeDB;
exports.wipeDB = wipeDB;
exports.openDB = openDB;
exports.registerDB = registerDB;
exports.pingDB = pingDB;
exports.activeDB = activeDB;
exports.prefetchDB = prefetchDB;
exports.rangeDB = rangeDB;
exports.keysDB = keysDB;
exports.searchDB = searchDB;
exports.makeKey = makeKey;
exports.formatKey = formatKey;
exports.autoKey = autoKey;
exports.hold = hold;
exports.valueRecord = valueRecord;
exports.existsRecord = existsRecord;
exports.readRecord = readRecord;
exports.getRecord = getRecord;
exports.deleteRecord = deleteRecord;
exports.removeRecord = removeRecord;
exports.writeRecord = writeRecord;
exports.putRecord = putRecord;
exports.moveRecord = moveRecord;
exports.leaderBoard = leaderBoard;
exports.createBackup = createBackup;
exports.removeBackup = removeBackup;
exports.restoreBackup = restoreBackup;
exports.transferDatabase = transferDatabase;
exports.migrationDatabases = migrationDatabases;
const promises_1 = require("fs/promises");
const forgescript_1 = require("@tryforge/forgescript");
const perf_hooks_1 = require("perf_hooks");
const path_1 = require("path");
const lmdb_1 = require("lmdb");
const errors_1 = require("./errors");
let emitter = null;
const databases = new Map();
const types = new Map();
exports.types = types;
const config = {
    path: (0, path_1.join)(process.cwd(), "database"),
    separator: "~",
    flags: {},
    events: {
        databaseConnect: false,
        recordUpdate: false,
        recordRemove: false,
        holdExpire: false
    }
};
exports.config = config;
const locked = ["path", "name", "dupSort", "useVersions", "maxDbs", "readOnly", "noSubdir"];
const entities = ["user", "member", "guild", "channel", "role", "message"];
const safeName = /^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/;
const registered = new Map();
// setTimeout overflows (and fires immediately) past 2^31-1 ms
const MAX_TIMEOUT = 2 ** 31 - 1;
function assertName(type) {
    if (typeof type !== "string" || !safeName.test(type) || type === "." || type === "..") {
        throw new errors_1.DatabaseError(`Invalid database type name "${type}"`);
    }
}
function getDB(type) {
    const db = databases.get(type);
    if (!db) {
        throw new errors_1.DatabaseError(types.has(type) ? `Database "${type}" is not open` : `Unknown database type "${type}"`);
    }
    return db;
}
function getSchema(type) {
    const schema = types.get(type);
    if (!schema)
        throw new errors_1.DatabaseError(`Unknown database type "${type}"`);
    return schema;
}
function edgeApi() {
    return globalThis[Symbol.for("quoriel.edge")];
}
function filterFlags(source) {
    const clean = {};
    for (const key in source) {
        if (!locked.includes(key))
            clean[key] = source[key];
    }
    return clean;
}
function isValidSchema(schema) {
    if (typeof schema !== "object" || schema === null)
        return false;
    if (schema.type !== null && !entities.includes(schema.type))
        return false;
    if (typeof schema.guild !== "boolean")
        return false;
    return true;
}
/**
 * Initializes the database folder and, when the QuorielEdge `structureDefaults`
 * feature is available, wires `valueRecord` to fall back on it.
 */
async function initDB(path) {
    if (path)
        config.path = (0, path_1.join)(process.cwd(), path);
    await reloadDB();
}
/**
 * Registers the emitter used to dispatch enabled events, and marks each
 * requested event as active.
 */
function setupEvents(secret, events) {
    emitter = secret;
    for (const name of events)
        config.events[name] = true;
    emitter.emit("databaseConnect");
}
/**
 * Reloads `config.json` from the database folder.
 */
async function reloadDB() {
    await (0, promises_1.mkdir)(config.path, { recursive: true });
    const content = await (0, promises_1.readFile)((0, path_1.join)(__dirname, "config.json"), "utf8");
    const full = (0, path_1.join)(config.path, "config.json");
    try {
        await (0, promises_1.writeFile)(full, content, { flag: "wx", encoding: "utf8" });
    }
    catch (error) {
        if (error.code !== "EEXIST")
            return;
    }
    try {
        const data = JSON.parse(await (0, promises_1.readFile)(full, "utf8"));
        if (data.separator) {
            config.separator = data.separator;
        }
        if (data.flags) {
            for (const key in config.flags)
                delete config.flags[key];
            Object.assign(config.flags, filterFlags(data.flags));
        }
        if (data.types) {
            types.clear();
            for (const key in data.types) {
                if (isValidSchema(data.types[key]))
                    types.set(key, data.types[key]);
            }
            for (const [key, schema] of registered)
                if (!types.has(key))
                    types.set(key, schema);
        }
    }
    catch (error) {
        forgescript_1.Logger.error(error);
    }
}
/**
 * Closes the given databases.
 */
async function closeDB(array) {
    for (const type of array) {
        const db = databases.get(type);
        if (!db)
            continue;
        databases.delete(type);
        await db.close();
    }
}
/**
 * Closes the given databases and deletes their files.
 */
async function wipeDB(array) {
    for (const type of array)
        assertName(type);
    await closeDB(array);
    for (const type of array) {
        await (0, promises_1.rm)((0, path_1.join)(config.path, "types", type), { recursive: true, force: true });
    }
}
function scheduleHoldExpire(db, type, key, name, value) {
    const wait = value - Date.now();
    const timer = setTimeout(() => {
        if (wait > MAX_TIMEOUT)
            return scheduleHoldExpire(db, type, key, name, value);
        if (databases.get(type) === db && db.get(key)?.holds?.[name] === value)
            emitter.emit("holdExpire", { type, key, name, value });
    }, Math.min(Math.max(wait, 0), MAX_TIMEOUT));
    timer.unref();
}
function openDatabase(type, flags = {}) {
    const db = (0, lmdb_1.open)({
        ...config.flags,
        ...flags,
        useVersions: false,
        dupSort: false,
        path: (0, path_1.join)(config.path, "types", type)
    });
    databases.set(type, db);
    if (config.events.holdExpire) {
        for (const item of db.getRange({ snapshot: false })) {
            const value = item.value.holds;
            if (!value)
                continue;
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
function openDB(array) {
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
function registerDB(name, schema, flags = {}) {
    if (!types.has(name)) {
        if (!isValidSchema(schema))
            return false;
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
function pingDB(type) {
    const start = perf_hooks_1.performance.now();
    getDB(type).get("ping");
    return Math.round(perf_hooks_1.performance.now() - start);
}
/**
 * Names of the currently open databases.
 */
function activeDB() {
    return [...databases.keys()];
}
/**
 * Loads the given keys into memory.
 */
async function prefetchDB(type, keys) {
    await getDB(type).prefetch(keys);
}
/**
 * Every record of a database.
 */
function rangeDB(type) {
    const result = [];
    for (const item of getDB(type).getRange({ snapshot: false }))
        result.push(item);
    return result;
}
/**
 * Every key of a database.
 */
function keysDB(type) {
    const result = [];
    for (const key of getDB(type).getKeys({ snapshot: false }))
        result.push(key);
    return result;
}
/**
 * Searches records by any combination of filters. Omitting `type` searches
 * every open database.
 */
function searchDB(type, name, valueType, value, entity, guild) {
    const nof = !name && !valueType && !value;
    const sep = config.separator;
    const res = [];
    if (type) {
        processSearch(type, getDB(type), nof, res, sep, name, valueType, value, entity, guild);
    }
    else {
        for (const ent of databases) {
            processSearch(ent[0], ent[1], nof, res, sep, name, valueType, value, entity, guild);
        }
    }
    return res;
}
function processSearch(type, db, nof, res, sep, name, valueType, value, entity, guild) {
    const is = getSchema(type).guild;
    if (guild && !is)
        return;
    for (const item of db.getRange({ snapshot: false })) {
        const key = item.key;
        const val = item.value;
        if (is) {
            const pos = key.indexOf(sep);
            if (entity && key.substring(0, pos) !== entity)
                continue;
            if (guild && key.substring(pos + 1) !== guild)
                continue;
        }
        else {
            if (entity && key !== entity)
                continue;
        }
        if (nof) {
            res.push({ type, key, value: val });
            continue;
        }
        const fil = {};
        let hit = false;
        if (name) {
            if (!(name in val))
                continue;
            const pv = val[name];
            if (valueType && typeDefinition(pv) !== valueType)
                continue;
            if (value && pv !== value)
                continue;
            fil[name] = pv;
            hit = true;
        }
        else {
            for (const prop in val) {
                const pv = val[prop];
                if (valueType && typeDefinition(pv) !== valueType)
                    continue;
                if (value && pv !== value)
                    continue;
                fil[prop] = pv;
                hit = true;
            }
        }
        if (!hit)
            continue;
        res.push({ type, key, value: fil });
    }
}
function typeDefinition(value) {
    if (Array.isArray(value))
        return "array";
    const t = typeof value;
    if (t !== "string")
        return t;
    const trimmed = value.trim();
    return trimmed && !isNaN(+trimmed) ? "number" : "string";
}
/**
 * Builds a record key, taking the entity from the context when it is omitted.
 */
function makeKey(ctx, type, entity, guild) {
    const view = getSchema(type);
    if (!entity)
        entity = view.type ? ctx[view.type]?.id : undefined;
    if (!entity)
        throw new errors_1.DatabaseError(`Cannot resolve the "${type}" key: no entity given and none in this context`);
    if (view.guild) {
        const id = guild ?? ctx.guild?.id;
        if (!id)
            throw new errors_1.DatabaseError(`Cannot resolve the "${type}" key: no guild given and none in this context`);
        return entity + config.separator + id;
    }
    return entity;
}
/**
 * Joins an entity and a guild into a record key, without touching the context.
 */
function formatKey(type, entity, guild) {
    if (getSchema(type).guild)
        return entity + config.separator + guild;
    return entity;
}
/**
 * Builds a record key entirely from the context.
 */
function autoKey(ctx, type) {
    return makeKey(ctx, type);
}
/**
 * Applies a hold, returning the updated record or `null` when the hold is
 * already active.
 */
async function hold(type, key, data, name, duration) {
    const now = Date.now();
    if (data?.holds?.[name] > now)
        return null;
    const value = now + duration;
    const next = { ...data, holds: { ...data?.holds, [name]: value } };
    const db = getDB(type);
    await writeRecord(db, type, key, next);
    if (config.events.holdExpire)
        scheduleHoldExpire(db, type, key, name, value);
    return next;
}
/**
 * Single field of a record, falling back to the structure default when the
 * `structureDefaults` feature of QuorielEdge is enabled.
 */
function valueRecord(type, key, name) {
    const value = getDB(type).get(key)?.[name];
    const copy = value !== null && typeof value === "object" ? (Array.isArray(value) ? [...value] : { ...value }) : value;
    const edge = edgeApi();
    return edge?.features.has("structureDefaults") ? edge.resolveDefault(copy, type, name) : copy;
}
/**
 * Whether a key is stored.
 */
function existsRecord(type, key) {
    // doesExist keeps answering true for removed keys when the `cache` flag is on
    return getDB(type).get(key) !== undefined;
}
/**
 * `getRecord` against an already resolved handle.
 */
function readRecord(db, type, key) {
    return { ...db.get(key) };
}
/**
 * Copy of a record, empty when it is not stored.
 */
function getRecord(type, key) {
    return readRecord(getDB(type), type, key);
}
/**
 * `removeRecord` against an already resolved handle. Resolves to the LMDB
 * result when `recordRemove` is disabled.
 */
async function deleteRecord(db, type, key) {
    if (!config.events.recordRemove)
        return db.remove(key);
    const value = db.get(key);
    if (value !== undefined) {
        await db.remove(key);
        emitter.emit("recordRemove", { type, key, value: { ...value } });
    }
}
/**
 * Deletes a record. Emits `recordRemove` when enabled.
 */
async function removeRecord(type, key) {
    await deleteRecord(getDB(type), type, key);
}
/**
 * `putRecord` against an already resolved handle, without the empty-object and
 * shape checks. Resolves to the LMDB result when `recordUpdate` is disabled.
 */
async function writeRecord(db, type, key, data) {
    const stored = { ...data };
    if (!config.events.recordUpdate)
        return db.put(key, stored);
    const old = db.get(key);
    await db.put(key, stored);
    emitter.emit("recordUpdate", {
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
async function putRecord(type, key, data) {
    if (typeof data !== "object" || data === null || Array.isArray(data))
        return false;
    const db = getDB(type);
    if (Object.keys(data).length) {
        await writeRecord(db, type, key, data);
    }
    else {
        await deleteRecord(db, type, key);
    }
    return true;
}
/**
 * Moves a record to another key, deleting the source unless `deleteSource` is
 * `false`. Returns `false` when the source is not stored.
 */
async function moveRecord(type, fromKey, toKey, deleteSource) {
    const db = getDB(type);
    const original = db.get(fromKey);
    if (original === undefined)
        return false;
    await writeRecord(db, type, toKey, original);
    if (deleteSource !== false)
        await deleteRecord(db, type, fromKey);
    return true;
}
/**
 * Ranks records by a numeric field. Guild types keep only the given guild.
 */
function leaderBoard(type, name, sorting, guild) {
    const is = getSchema(type).guild;
    const items = [];
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
    for (let i = 0, l = items.length; i < l; i++)
        items[i].position = i + 1;
    return { type: getSchema(type).type, items: items, count: items.length };
}
/**
 * Replaces the backup of a type with a fresh one.
 */
async function createBackup(type) {
    assertName(type);
    const db = getDB(type);
    const full = (0, path_1.join)(config.path, "backups", type);
    await (0, promises_1.rm)(full, { recursive: true, force: true });
    await (0, promises_1.mkdir)(full, { recursive: true });
    await db.backup(full, false);
}
/**
 * Deletes the backup of a type.
 */
async function removeBackup(type) {
    assertName(type);
    await (0, promises_1.rm)((0, path_1.join)(config.path, "backups", type), { recursive: true, force: true });
}
/**
 * Restores a type from its backup. Returns `false` when the database is
 * already present or open, or when there is no backup.
 */
async function restoreBackup(type) {
    assertName(type);
    if (!types.has(type) || databases.has(type))
        return false;
    const db = (0, path_1.join)(config.path, "types", type);
    try {
        await (0, promises_1.access)(db);
        return false;
    }
    catch {
        // it just works ¯\_(ツ)_/¯
    }
    const backup = (0, path_1.join)(config.path, "backups", type);
    try {
        await (0, promises_1.access)(backup);
    }
    catch {
        return false;
    }
    await (0, promises_1.cp)(backup, db, { recursive: true });
    return true;
}
/**
 * Copies data from ForgeDB, waiting for it to be ready. `rewrite` controls
 * whether existing fields are overwritten.
 */
async function transferDatabase(client, rewrite = false) {
    forgescript_1.Logger.info("[QuorielDB] The transfer code will run as soon as ForgeDB is initialized!");
    let items;
    while (true) {
        try {
            items = await client.db.getAll();
            break;
        }
        catch {
            forgescript_1.Logger.info("[QuorielDB] Waiting for ForgeDB to be ready, retrying in 5 seconds...");
            await wait(5000);
        }
    }
    forgescript_1.Logger.info("[QuorielDB] The data transfer code has been started.");
    for (const item of items) {
        if (item.type !== "old") {
            const type = item.type.replace("custom", "global");
            if (!databases.has(type)) {
                openDB([type]);
                await wait(2000);
            }
            let key;
            if (type === "global") {
                key = "custom";
            }
            else if (type === "user" || type === "guild") {
                key = item.id;
            }
            else {
                key = formatKey(type, item.id, item.guildId);
            }
            let value;
            try {
                value = JSON.parse(item.value);
            }
            catch {
                value = item.value;
            }
            const db = getDB(type);
            const original = db.get(key);
            const data = { ...original };
            if (rewrite || !data.hasOwnProperty(item.name)) {
                data[item.name] = value;
                await db.put(key, data);
            }
        }
    }
    forgescript_1.Logger.info("[QuorielDB] Data transfer completed!");
}
/**
 * Rebuilds every database with the given flags. Requires exclusive access.
 */
async function migrationDatabases(options) {
    forgescript_1.Logger.info("[QuorielDB] Migration started - tools aligned, buffers cleared, engines humming.");
    const migrationPath = (0, path_1.join)(config.path, "migration");
    const typesMigrate = await (0, promises_1.readdir)((0, path_1.join)(config.path, "types"));
    const oldFlags = options || {
        noReadAhead: true,
        noMemInit: true,
        cache: true
    };
    await (0, promises_1.cp)((0, path_1.join)(config.path, "types"), migrationPath, { recursive: true });
    for (const type of typesMigrate) {
        await (0, promises_1.rm)((0, path_1.join)(config.path, "types", type), { recursive: true, force: true });
        const oldDB = (0, lmdb_1.open)({
            ...oldFlags,
            path: (0, path_1.join)(migrationPath, type)
        });
        const newDB = (0, lmdb_1.open)({
            ...config.flags,
            useVersions: false,
            dupSort: false,
            path: (0, path_1.join)(config.path, "types", type)
        });
        for (const item of oldDB.getRange({ snapshot: false })) {
            await newDB.put(item.key, item.value);
        }
        await oldDB.close();
        await newDB.close();
    }
    await (0, promises_1.rm)(migrationPath, { recursive: true, force: true });
    forgescript_1.Logger.info(`[QuorielDB] Migration complete! Types updated (${typesMigrate.join(", ")})`);
}
async function wait(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=db.js.map