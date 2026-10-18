/**
 * Raised for problems caused by script input (unknown or closed types, keys
 * that cannot be resolved, invalid names). Native functions turn it into a
 * regular ForgeScript error.
 */
export declare class DatabaseError extends Error {
    constructor(message: string);
}
//# sourceMappingURL=errors.d.ts.map