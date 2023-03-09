const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params?.userId || res.user.id;
    if (userId) {
      res.status(400);
      throw new Error("User id not found");
    }

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400);
      throw new Error("Invalid post id");
    }

    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const userIdTarget = req.params.userId;
    const { email, password, bio, profilePicture } = req.body;
    const userId = res.user.id;

    if (userId === userIdTarget) {
      res.status(400);
      throw new Error("Permission denied");
    }

    if (!email && !password && !bio && !profilePicture) {
      res.status(400);
      throw new Error("Provide at least one field to update");
    }

    var hash;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    const user = await User.findById(userId);

    if (
      user.email === email &&
      user.hash === hash &&
      user.bio === bio &&
      user.profilePicture === profilePicture
    ) {
      res.status(400);
      throw new Error("Nothing change to commit");
    }

    if (email) user.email = email;
    if (hash) user.hash = hash;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const userIdTarget = req.params.userId;
    const password = req.body.password;
    const userId = res.user.id;

    if (userId === userIdTarget) {
      res.status(400);
      throw new Error("Permission denied");
    }

    if (!password) {
      res.status(400);
      throw new Error("Password is empty");
    }

    var hash;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    const user = await User.findOneAndDelete({ _id: userId, hash });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const followUserById = async (req, res, next) => {
  try {
    const userIdTarget = req.params.userId;
    const userId = res.user.id;

    if (userId === userIdTarget) {
      res.status(400);
      throw new Error("You can not follow yourself");
    }

    if (!mongoose.isValidObjectId(userIdTarget)) {
      res.status(400);
      throw new Error("Invalid user id");
    }

    const otherPerson = await User.findById(userIdTarget);

    if (otherPerson.followers.includes(userId)) {
      res.status(400);
      throw new Error("Already following");
    }

    const user = await User.findById(userId);

    otherPerson.followers.push(userId);
    await otherPerson.save();

    user.followings.push(userIdTarget);
    await user.save();

    res.status(200).json(otherPerson);
  } catch (error) {
    next(error);
  }
};

const unfollowUserById = async (req, res, next) => {
  try {
    const userIdTarget = req.params.userId;
    const userId = res.user.id;

    if (userId === userIdTarget) {
      res.status(400);
      throw new Error("You can not follow yourself");
    }
    
    if (!mongoose.isValidObjectId(userIdTarget)) {
      res.status(400);
      throw new Error("Invalid user id");
    }

    const otherPerson = await User.findById(userIdTarget);

    if (!otherPerson.followers.includes(userId)) {
      res.status(400);
      throw new Error("Not following at the first place");
    }

    const user = await User.findById(userId);

    const followerIndex = otherPerson.followers.indexOf(userId);
    otherPerson.followers.splice(followerIndex, 1);
    await otherPerson.save();

    const followingIndex = user.followings.indexOf(userIdTarget);
    user.followings.splice(followingIndex);
    await user.save();

    res.status(200).json(otherPerson);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserById,
  updateUserById,
  deleteUserById,
  followUserById,
  unfollowUserById,
};
