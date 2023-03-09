const jwt = require("jsonwebtoken");
const { jwtSecret, tokenValidity } = require("../config/config");

const verify = (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      res.status(400);
      throw new Error("Token not found");
    }
    var decode;
    jwt.verify(token, jwtSecret, (error, data) => {
      if (error) {
        res.status(400);
        throw new Error("Token is invalid");
      } else {
        decode = data;
        const then = decode.iat * 1000;
        const now = new Date().getTime();
        const diff = now - then;

        if (tokenValidity - diff < 0) {
          res.status(400);
          throw new Error("Token expired");
        }

        if (decode.ip !== req.ip) {
        //   res.status(400);
        //   throw new Error("Ip didn't match");
        }
      }
    });

    console.log(`✔ Verified : ${decode.username}`);

    const { iat, ...newTokenData } = decode;
    const newToken = jwt.sign(newTokenData, jwtSecret);
    res.set("token", newToken);
    res.user = { id: decode.id, name: decode.username };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verify;
