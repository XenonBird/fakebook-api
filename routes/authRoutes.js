const authRoutes = require("express").Router();
const {
  loginUser,
  registerUser,
  logoutUser,
} = require("../controllers/authController");

// Methods
authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);

module.exports = authRoutes;
