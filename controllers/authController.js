const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/config");
const User = require("../models/userModel");

const registerUser = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      res.status(400);
      throw new Error("Required input(s) is/are missing");
    }

    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      res.status(400);
      throw new Error("Email already registered");
    }

    const isUsernameExists = await User.findOne({ email });
    if (isUsernameExists) {
      res.status(400);
      throw new Error("Username already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, username, hash: hashedPassword });
    const user = await newUser.save();

    const tokenData = { id: user._id, username: user.username, ip: req.ip };
    const token = jwt.sign(tokenData, jwtSecret);

    const { hash, type, updatedAt, __v, ...others } = user._doc;

    res.set("token", token);
    res.status(200).json({ user: others });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Required input(s) is/are missing");
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("Email not found");
    }

    const matched = await bcrypt.compare(password, user.hash);
    if (!matched) {
      res.status(400);
      throw new Error("Incorrect password");
    }

    const tokenData = { id: user._id, username: user.username, ip: req.ip };
    const token = jwt.sign(tokenData, jwtSecret);
    const { hash, type, updatedAt, __v, ...others } = user._doc;

    res.set("token", token);
    res.status(200).json({ user: others });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.set("token", "");
    res.status(200).json("OK");
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, logoutUser };
