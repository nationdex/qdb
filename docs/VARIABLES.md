# Variables (ForgeDB style)

If you are coming from **ForgeDB**, you do not need `$getRecord`, `$env` and `$putRecord` to work with a single variable. QuorielDB has the same direct functions, with the same argument order:

| ForgeDB | QuorielDB |
| --- | --- |
| `$getUserVar[name;userID;default]` | same |
| `$setUserVar[name;value;userID]` | same |
| `$deleteUserVar[name;userID]` | same |
| `$getMemberVar[name;memberID;guildID;default]` | same |
| `$setMemberVar[name;value;memberID;guildID]` | same |
| `$getGuildVar[name;guildID;default]` (alias `$getServerVar`) | same |
| `$getChannelVar` / `$getRoleVar` / `$getMessageVar` | same |
| `$getGlobalVar[name;default]` / `$setGlobalVar[name;value]` | same |

Every `get`/`set`/`delete` exists for `User`, `Member`, `Guild`, `Channel`, `Role`, `Message` and `Global`.

```
$setUserVar[coins;$sum[$getUserVar[coins];10]]
You have $getUserVar[coins] coins
```

## How it behaves

- **The value comes back as is.** `$getUserVar[coins]` gives `50`, not a JSON document. Objects and arrays are returned as JSON text.
- **Nothing to open.** The database of a configured type is opened the first time a variable is used.
- **The ID is optional.** When omitted it is taken from the context (the author, the guild, the channel...). If it cannot be found you get an error instead of a record under a made-up key.
- **Types.** Text that is a number, `true`/`false` or JSON is stored as that value, so math and conditions work. Anything that does not read back identically (`007`, `1e3`) stays text.
- **Defaults.** When the variable is not set, the `default` argument is returned. With the `structureDefaults` feature of [QuorielEdge](https://github.com/nationdex/edge) the default can come from a structure named after the type, for example `user.json` holding `{ "coins": 0 }`.
- **Events.** `recordUpdate` and `recordRemove` fire as they do for `$putRecord`.
- **Global variables** live in the `custom` record of the `global` type, the same place [`transferDatabase`](TRANSFER.md) puts ForgeDB's `custom` data.

For several variables at once, or for leaderboards, keep using the `Record` and `Board` functions (`$getRecord`, `$putRecord`, `$leaderBoard`...).
