if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const mongoConnect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected `);
    return mongoose.connection;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = { mongoConnect };
