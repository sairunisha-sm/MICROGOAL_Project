const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );
};

module.exports = generateToken;