const dotenv = require("dotenv").config();

module.exports = {
  db: {
    atlas: true,
    name: "fakebook",
    user: process.env.DB_USER || "anonymous",
    pass: process.env.DB_PASS || "",
    host: "http://localhost/",
  },
  port: 5000,
  jwtSecret: process.env.JWT_SECRET,
};
