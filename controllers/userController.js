const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const getUserById = async (req, res, next) => {
  try {
    const userId = req.params?.userId || res.user.id;
    if (!userId) {
      res.status(400);
      throw new Error("User id not found");
    }

    if (!mongoose.isValidObjectId(userId)) {
      res.status(400);
      throw new Error("Invalid post id");
    }

    const user = await User.findById(userId)
      .populate("followers", "username")
      .populate("followings", "username");
      
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const { hash, __v, updatedAt, type, email, ...others } = user._doc;

    res.status(200).json({ ...others });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const userIdTarget = req.params.userId;
    const { email, bio, profilePicture } = req.body;
    const userId = res.user.id;

    if (userId !== userIdTarget) {
      res.status(400);
      throw new Error("Permission denied");
    }

    if (!email && !bio && !profilePicture) {
      res.status(400);
      throw new Error("Provide at least one field to update");
    }

    const user = await User.findById(userId);

    var numberOfChanges = 0;

    if (email && user.email !== email) {
      ++numberOfChanges;
    }
    if (bio && user.bio !== bio) {
      user.bio = bio;
      ++numberOfChanges;
    }
    if (profilePicture && user.profilePicture === profilePicture) {
      user.profilePicture = profilePicture;
      ++numberOfChanges;
    }
    await user.save();

    const { hash, __v, updatedAt, type, ...others } = user._doc;

    res.status(200).json({ numberOfChanges, user: others });
  } catch (error) {
    next(error);
  }
};

const updatePasswordById = async (req, res, next) => {
  try {
    const userIdTarget = req.params.userId;
    const { email, bio, profilePicture } = req.body;
    const userId = res.user.id;

    if (userId !== userIdTarget) {
      res.status(400);
      throw new Error("Permission denied");
    }

    if (!password) {
      res.status(400);
      throw new Error("Password is not provided");
    }

    const user = await User.findById(userId);

    const isMatch = bcrypt.compareSync(password, user.hash);
    if (isMatch) {
      res.status(400);
      throw new Error("This is old password");
    }

    const newHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    user.hash = newHash;
    const done = await user.save();

    res.status(200).json(done);
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const userIdTarget = req.params.userId;
    const password = req.body.password;
    const userId = res.user.id;

    if (userId !== userIdTarget) {
      res.status(400);
      throw new Error("Permission denied");
    }

    if (!password) {
      res.status(400);
      throw new Error("Password is empty");
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    const passwordMatched = bcrypt.compareSync(password, user.hash);
    if (!passwordMatched) {
      res.status(400);
      throw new Error("Password is incorrect");
    }

    const done = await User.findByIdAndDelete(userId);

    res.status(200).json(done);
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
  updatePasswordById,
  deleteUserById,
  followUserById,
  unfollowUserById,
};
