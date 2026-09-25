"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.types = exports.restoreBackup = exports.removeBackup = exports.createBackup = exports.putRecord = exports.moveRecord = exports.writeRecord = exports.removeRecord = exports.deleteRecord = exports.existsRecord = exports.valueRecord = exports.readRecord = exports.getRecord = exports.prefetchDB = exports.registerDB = exports.searchDB = exports.reloadDB = exports.rangeDB = exports.wipeDB = exports.pingDB = exports.openDB = exports.keysDB = exports.closeDB = exports.activeDB = exports.leaderBoard = exports.transferDatabase = exports.migrationDatabases = exports.autoKey = exports.formatKey = exports.makeKey = exports.hold = exports.QuorielDB = void 0;
const forgescript_1 = require("@tryforge/forgescript");
const events_1 = require("@eolthar/events");
const commandManager_1 = require("./managers/commandManager");
const db = __importStar(require("./db"));
const { description, version } = require("../package.json");
const { initDB, setupEvents, ...functions } = db;
/**
 * ForgeScript extension exposing LMDB-backed storage.
 */
class QuorielDB extends forgescript_1.ForgeExtension {
    name = "QuorielDB";
    description = description;
    version = version;
    /**
     * Emitter the registered events are dispatched on.
     */
    emitter = new events_1.Emitter();
    /**
     * Loads a folder of event modules. Assigned during `init`.
     */
    commands;
    options;
    constructor(options) {
        super();
        this.options = options;
    }
    async init(client) {
        this.commands = new commandManager_1.CommandManager(client);
        this.load(__dirname + "/functions");
        if (this.options?.events?.length) {
            forgescript_1.EventManager.load("QuorielDBEvents", __dirname + "/events");
            client.events.load("QuorielDBEvents", this.options.events);
        }
        await initDB(this.options?.path);
        if (this.options?.events?.length)
            setupEvents(this.emitter, this.options.events);
    }
}
exports.QuorielDB = QuorielDB;
exports.hold = functions.hold, exports.makeKey = functions.makeKey, exports.formatKey = functions.formatKey, exports.autoKey = functions.autoKey, exports.migrationDatabases = functions.migrationDatabases, exports.transferDatabase = functions.transferDatabase, exports.leaderBoard = functions.leaderBoard, exports.activeDB = functions.activeDB, exports.closeDB = functions.closeDB, exports.keysDB = functions.keysDB, exports.openDB = functions.openDB, exports.pingDB = functions.pingDB, exports.wipeDB = functions.wipeDB, exports.rangeDB = functions.rangeDB, exports.reloadDB = functions.reloadDB, exports.searchDB = functions.searchDB, exports.registerDB = functions.registerDB, exports.prefetchDB = functions.prefetchDB, exports.getRecord = functions.getRecord, exports.readRecord = functions.readRecord, exports.valueRecord = functions.valueRecord, exports.existsRecord = functions.existsRecord, exports.deleteRecord = functions.deleteRecord, exports.removeRecord = functions.removeRecord, exports.writeRecord = functions.writeRecord, exports.moveRecord = functions.moveRecord, exports.putRecord = functions.putRecord, exports.createBackup = functions.createBackup, exports.removeBackup = functions.removeBackup, exports.restoreBackup = functions.restoreBackup, exports.types = functions.types, exports.config = functions.config;
//# sourceMappingURL=main.js.map