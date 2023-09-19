if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
("use strict");
const encodedCA = process.env.ARANGO_SECRET;

const { Database, aql } = require("arangojs");
const db = new Database({
  url: process.env.ARANGO_URL,
  agentOptions: { ca: Buffer.from(encodedCA, "base64") },
  // databaseName: process.env.ARANGO_DB,
  auth: { username: process.env.ARANGO_USER, password: process.env.ARANGO_PW },
});

const arangoConnect = async () => {
  try {
    const version = await db.version();
    const database = await db.userDatabases(process.env.ARANGO_DB);
    console.log(`ArangoDB ver ${version.version} connected`);
    return db;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = { arangoConnect, db };
