if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { Ottoman } = require("ottoman");
const ottoman = new Ottoman({
  modelKey: "type",
  scopeName: "_default",
  connectTimeout: 30000,
});
const couchConnect = async () => {
  try {
    await ottoman.connect({
      bucketName: process.env.COUCH_BUCKET,
      connectionString: process.env.COUCH_URL,
      username: process.env.COUCH_USER,
      password: process.env.COUCH_PASS,
    });
    await ottoman.start();
    console.log(`Couchbase Connected `);
  } catch (err) {
    console.log(err);
    // process.exit(1);
  }
};

module.exports = { couchConnect, ottoman };
