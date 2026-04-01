const jwt = require("jsonwebtoken");

class JwtTokenGenerator {
  generate(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  }
}

module.exports = JwtTokenGenerator;
