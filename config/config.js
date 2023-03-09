const dotenv = require("dotenv").config();

module.exports = {
  db: {
    name: "fakebook",
    user: process.env.DB_USER || "anonymous",
    pass: process.env.DB_PASS || "",
    url: process.env.DB_URL || "",
  },
  port: 5000,
  tokenValidity: process.env.TOKEN_VALIDITY || 86400000, // 1 day in milliseconds
  jwtSecret: process.env.JWT_SECRET,
};
