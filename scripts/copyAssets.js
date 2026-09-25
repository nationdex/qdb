const { copyFileSync } = require("fs");
const { join } = require("path");

copyFileSync(join(__dirname, "../src/config.json"), join(__dirname, "../dist/config.json"));
