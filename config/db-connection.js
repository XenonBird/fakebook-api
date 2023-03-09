const mongoose = require("mongoose");
const { db } = require("./config");

// MONGOOSE CONFIGURATION
mongoose.set("strictQuery", false);

const url = db.url;

// CONNECTION TO MONGODB
mongoose
  .connect(url, {
    dbName: db.name,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("🟢 Connected to MongoDB\n");
  })
  .catch((error) => {
    console.error("🔴 Error connecting to MongoDB: ", error);
  });
