import { NativeFunction } from "@tryforge/forgescript";
import type { IArg, INativeFunction } from "@tryforge/forgescript";
/**
 * `new NativeFunction(...)` whose `execute` reports an `DatabaseError` as a
 * ForgeScript error instead of letting it escape as an exception.
 */
export declare function defineFunction<T extends [...IArg[]], Unwrap extends boolean = boolean>(data: INativeFunction<T, Unwrap>): NativeFunction<T, Unwrap>;
//# sourceMappingURL=define.d.ts.map