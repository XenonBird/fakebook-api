const userRoutes = require("express").Router();
const {
  updateUserById,
  updatePasswordById,
  deleteUserById,
  getUserById,
  followUserById,
  unfollowUserById,
} = require("../controllers/userController");
const verify = require("./verify");

userRoutes.get("/", verify, getUserById);
userRoutes.get("/:userId", verify, getUserById);
userRoutes.put("/:userId", verify, updateUserById);
userRoutes.put("/:userId/password", verify, updatePasswordById);
userRoutes.delete("/:userId", verify, deleteUserById);

userRoutes.post("/:userId/follow", verify, followUserById);
userRoutes.post("/:userId/unfollow", verify, unfollowUserById);

module.exports = userRoutes;
