"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = void 0;
/**
 * Raised for problems caused by script input (unknown or closed types, keys
 * that cannot be resolved, invalid names). Native functions turn it into a
 * regular ForgeScript error.
 */
class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = "DatabaseError";
    }
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=errors.js.map