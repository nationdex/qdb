import { RootDatabaseOptions } from "lmdb";

/**
 * Stored record. Values are whatever the encoder round-trips.
 */
export type RecordData = Record<string, any>;

/**
 * Entity a type resolves its identifier from, or `null` when the identifier
 * must be supplied explicitly.
 */
export type EntityType = "user" | "member" | "guild" | "channel" | "role" | "message";

/**
 * Declaration of a database type, as written in `config.json` or passed to
 * `registerDB`.
 */
export interface TypeSchema {
    /**
     * Context entity the identifier is taken from, `null` to require it.
     */
    type: EntityType | null;

    /**
     * Whether keys of this type are bound to a guild.
     */
    guild: boolean;
}

/**
 * LMDB options accepted for opening a database. The reserved ones - `path`,
 * `name`, `dupSort`, `useVersions`, `maxDbs`, `readOnly`, `noSubdir` - are
 * stripped and cannot be overridden.
 */
export type DatabaseFlags = Omit<
    RootDatabaseOptions,
    "path" | "name" | "dupSort" | "useVersions" | "maxDbs" | "readOnly" | "noSubdir"
> & {
    /**
     * Disables OS read-ahead caching. Missing from the LMDB typings.
     */
    noReadAhead?: boolean;
};

/**
 * Events the extension can dispatch. Only the ones listed in the constructor
 * options are registered and emitted.
 */
export type EventName = "databaseConnect" | "recordUpdate" | "recordRemove" | "holdExpire";

/**
 * Runtime configuration, loaded from the `config.json` of the database folder.
 * Changing it after the databases are open is not supported.
 */
export interface Config {
    /**
     * Absolute path to the database folder.
     */
    path: string;

    /**
     * Character joining the entity and guild parts of a composite key.
     */
    separator: string;

    /**
     * Flags applied when a database is opened.
     */
    flags: DatabaseFlags;

    /**
     * Which events are enabled, filled from the constructor options.
     */
    events: Record<EventName, boolean>;
}

/**
 * Value kinds accepted by the `valueType` filter of `searchDB`. Numeric
 * strings are reported as `number`.
 */
export type ValueType = "string" | "number" | "boolean" | "object" | "array";

/**
 * Sorting direction of a leaderboard. Anything other than `asc` sorts
 * descending.
 */
export type SortingType = "asc" | "desc";

/**
 * Record returned by `rangeDB`.
 */
export interface RangeEntry {
    key: string;
    value: RecordData;
}

/**
 * Match returned by `searchDB`. `value` holds the whole record when no filter
 * was given, otherwise only the properties that matched.
 */
export interface SearchEntry {
    type: string;
    key: string;
    value: RecordData;
}

/**
 * Leaderboard entry. `position` is one-based and assigned after sorting.
 */
export interface BoardEntry {
    key: string;
    value: number;
    position: number;
}

/**
 * Result of `leaderBoard`.
 */
export interface Board {
    /**
     * Entity the ranked type resolves its identifiers from, `null` when they
     * are supplied explicitly.
     */
    type: EntityType | null;

    items: BoardEntry[];
    count: number;
}

/**
 * Payload of `recordUpdate`. `old` is absent when the key was not stored yet.
 */
export interface RecordUpdateData {
    type: string;
    key: string;
    value: {
        old?: RecordData;
        new: RecordData;
    };
}

/**
 * Payload of `recordRemove`, carrying the record as it was before deletion.
 */
export interface RecordRemoveData {
    type: string;
    key: string;
    value: RecordData;
}

/**
 * Payload of `holdExpire`. `value` is the timestamp the hold expired at.
 */
export interface HoldExpireData {
    type: string;
    key: string;
    name: string;
    value: number;
}

/**
 * Arguments each event is emitted with.
 */
export interface DatabaseEvents {
    databaseConnect: [];
    recordUpdate: [environment: RecordUpdateData];
    recordRemove: [environment: RecordRemoveData];
    holdExpire: [environment: HoldExpireData];
}

/**
 * Options of the `QuorielDB` constructor.
 */
export interface QuorielDBOptions {
    /**
     * Database folder, resolved against the working directory. Defaults to
     * `database`.
     */
    path?: string;

    /**
     * Events to register. Events left out are never emitted, and the work
     * behind them is skipped.
     */
    events?: EventName[];
}
