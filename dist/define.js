"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineFunction = defineFunction;
const forgescript_1 = require("@tryforge/forgescript");
const errors_1 = require("./errors");
/**
 * `new NativeFunction(...)` whose `execute` reports an `DatabaseError` as a
 * ForgeScript error instead of letting it escape as an exception.
 */
function defineFunction(data) {
    const execute = data.execute;
    const handle = (self, error) => {
        if (error instanceof errors_1.DatabaseError)
            return self.customError(error.message);
        throw error;
    };
    const wrapped = function (...args) {
        try {
            const result = execute.apply(this, args);
            return result instanceof Promise ? result.catch((error) => handle(this, error)) : result;
        }
        catch (error) {
            return handle(this, error);
        }
    };
    Object.defineProperty(wrapped, Symbol.toStringTag, { value: execute[Symbol.toStringTag] });
    return new forgescript_1.NativeFunction({ ...data, execute: wrapped });
}
//# sourceMappingURL=define.js.map