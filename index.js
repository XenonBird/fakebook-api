const express = require("express");
const morgan = require("morgan");
const ip = require("ip");
const cors = require("cors");
const { port } = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./routes/error");

// APP, MIDDLEWARES AND CONFIGURATIONS
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(cors());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.use(notFound);
app.use(errorHandler);

// STARTING
app.listen(port, () => {
  console.clear();
  require("./config/db-connection");
  console.log(`🟢 Server is running on http://${ip.address()}:${port}`);
});
