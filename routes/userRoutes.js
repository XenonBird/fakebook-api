const userRoutes = require("express").Router();
const {
  updateUserById,
  deleteUserById,
  getUserById,
  followUserById,
  unfollowUserById,
} = require("../controllers/userController");
const verify = require("./verify");

userRoutes.get("/", verify, getUserById);
userRoutes.get("/:userId", verify, getUserById);
userRoutes.put("/:userId", verify, updateUserById);
userRoutes.delete("/:userId", verify, deleteUserById);

userRoutes.post("/:userId/follow", followUserById);
userRoutes.post("/:userId/unfollow", unfollowUserById);

module.exports = userRoutes;
