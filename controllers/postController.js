const mongoose = require("mongoose");
const User = require("../models/userModel");
const Post = require("../models/postModel");

const createNewPost = async (req, res, next) => {
  try {
    const { content, image, video } = req.body;
    const userId = res.user.id;

    if (!content && !image && !video) {
      res.status(400);
      throw new Error("At least one of text, image or video is required");
    }

    const newPost = new Post({
      content: content,
      image: image,
      video: video,
      user: userId,
    });

    const post = await newPost.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    if (!mongoose.isValidObjectId(postId)) {
      res.status(400);
      throw new Error("Invalid post id");
    }

    const post = await Post.findById(postId).populate("user", "username");

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getTimeline = async (req, res, next) => {
  try {
    // const userId = res.user.id;
    // const user = await User.findById(userId);
    // const allFollowings = user.followings;

    const allPosts = await Post.find().limit(20);

    res.status(200).json({ allPosts });
  } catch (error) {
    next(error);
  }
};

const updatePostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { content, image, video } = req.body;
    const userId = res.user.id;

    if (!content && !image && !video) {
      res.status(400);
      throw new Error("Provide at least one field to update");
    }

    if (!mongoose.isValidObjectId(postId)) {
      res.status(400);
      throw new Error("Invalid post id");
    }

    const post = await Post.findById(postId).populate("user", "username");

    if (userId !== post.user._id.toString()) {
      res.status(400);
      throw new Error("Permission denied");
    }

    if (
      post.content === content &&
      post.image === image &&
      post.video === video
    ) {
      res.status(400);
      throw new Error("Nothing change to commit");
    }

    if (content) post.content = content;
    if (image) post.image = image;
    if (video) post.video = video;

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const deletePostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = res.user.id;

    if (!mongoose.isValidObjectId(postId)) {
      res.status(400);
      throw new Error("Invalid post id");
    }

    const post = await Post.findById(postId);

    if (userId !== post.user._id.toString()) {
      res.status(400);
      throw new Error("Permission denied");
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const likePostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = res.user.id;

    if (!mongoose.isValidObjectId(postId)) {
      res.status(400);
      throw new Error("Invalid post id");
    }

    const post = await Post.findById(postId);

    if (!post) {
      res.status(400);
      throw new Error("Post not found");
    }

    if (post.likes.includes(userId)) {
      res.status(400);
      throw new Error("Already liked");
    }

    post.likes.push(userId);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const unlikePostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = res.user.id;

    if (!mongoose.isValidObjectId(postId)) {
      res.status(400);
      throw new Error("Invalid post id");
    }

    const post = await Post.findById(postId);

    if (!post) {
      res.status(400);
      throw new Error("Post not found");
    }

    if (!post.likes.includes(userId)) {
      res.status(400);
      throw new Error("Not liked at the first place");
    }

    const index = post.likes.indexOf(userId);
    post.likes.splice(index, 1);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewPost,
  getTimeline,
  getPostById,
  updatePostById,
  deletePostById,
  likePostById,
  unlikePostById,
};
