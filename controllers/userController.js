const bcrypt = require("bcrypt");

const updateUser = async (req, res, next) => {
  try {
    const { email, password, bio, profilePicture } = req.body;

    if (!email && !password && !bio && !profilePicture) {
      res.status(400);
      throw new Error("Provide at least one field to update");
    }

    var hash = "";
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    // get id from verify

    res.status(200).json()

  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateUser,
};
