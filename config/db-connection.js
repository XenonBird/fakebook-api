const mongoose = require("mongoose");
const { db } = require("./config");

// MONGOOSE CONFIGURATION
mongoose.set("strictQuery", false);

var uri;
if (db.atlas) {
  // FOR ATLAS
  url = `mongodb+srv://${db.user}:${db.pass}@database0.ujbgmdc.mongodb.net/?retryWrites=true&w=majority`;
} else {
  // FOR LOCAL
  url = `mongodb://${db.host}:${db.port}`;
}

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
