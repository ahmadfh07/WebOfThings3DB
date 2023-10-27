if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { mongoConnect } = require("./utils/mongoConnect.js");
const { couchConnect, ottoman } = require("./utils/couchConnect.js");
const { arangoConnect } = require("./utils/arangoConnect.js");
const bodyParser = require("body-parser");
const express = require("express");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/usemongo", require("./controller/mongoRoutes.js"));
app.use("/usecouch", require("./controller/couchRoutes.js"));
app.use("/usearango", require("./controller/arangoRoutes.js"));

app.use((req, res) => {
  res.status(404).json({ message: "page not found" });
});

(async () => {
  const mongo = await mongoConnect();
  const couch = await couchConnect();
  const arango = await arangoConnect();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on port ${PORT} in ${app.settings.env} mode`);
  });
})();
