# QuorielDB
An intuitive and high-performance interface for working with databases in **ForgeScript**, providing reliable and scalable data storage using **LMDB**.

## Installation
```
npm i @quoriel/db lmdb
```

## Connection
```js
const { ForgeClient } = require("@tryforge/forgescript");
const { QuorielDB } = require("@quoriel/db");

const db = new QuorielDB({
    events: [
        "databaseConnect",
        "recordUpdate",
        "recordRemove"
    ]
});

const client = new ForgeClient({
    extensions: [
        db
    ]
});

// Loading events.
db.commands.load("events");

client.login("...");
```

The same works from TypeScript, with full type information out of the box:
```ts
import { ForgeClient } from "@tryforge/forgescript";
import { QuorielDB } from "@quoriel/db";

const db = new QuorielDB({
    events: ["databaseConnect", "recordUpdate", "recordRemove"]
});

const client = new ForgeClient({ extensions: [db] });

db.commands.load("events");

client.login("...");
```

## TypeScript
QuorielDB is written in TypeScript and ships its own declaration files - no
`@types` package is needed. `require()` from JavaScript and `import` from
TypeScript both resolve to the same compiled `dist/` output, so both are
fully supported.

## Useful
- Configuring the database to fit your bot's needs [View documentation](https://github.com/quoriel/db/blob/main/docs/CONFIG.md)
- Setting default values for missing data via schemas [View documentation](https://github.com/quoriel/edge/blob/main/docs/DEFAULTS.md)
- Migrating databases created with versions below **2.0.0** [View documentation](https://github.com/quoriel/db/blob/main/docs/MIGRATION.md)
- Interacting with the database using direct **JS** functions [View documentation](https://github.com/quoriel/db/blob/main/docs/FUNCTIONS.md)
- Transferring data from **ForgeDB** to **QuorielDB** [View documentation](https://github.com/quoriel/db/blob/main/docs/TRANSFER.md)
- Registering custom database types for extensions [View documentation](https://github.com/quoriel/db/blob/main/docs/REGISTER.md)