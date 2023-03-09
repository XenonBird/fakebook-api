const postRoutes = require("express").Router();
const {
  createNewPost,
  getPostById,
  updatePostById,
  deletePostById,
  getTimeline,
  likePostById,
  unlikePostById,
} = require("../controllers/postController");
const verify = require("./verify");

postRoutes.post("/", verify, createNewPost);
postRoutes.get("/", verify, getTimeline);
postRoutes.get("/:postId", getPostById);
postRoutes.put("/:postId", verify, updatePostById);
postRoutes.delete("/:postId", verify, deletePostById);

postRoutes.post("/:postId/like", verify, likePostById);
postRoutes.post("/:postId/unlike", verify, unlikePostById);

module.exports = postRoutes;
