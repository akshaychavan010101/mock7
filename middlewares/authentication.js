const jwt = require("jsonwebtoken");
require("dotenv").config();
const authenticate = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Please login" });
    }
    const token = req.headers.authorization.split(" ")[1];
   
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: err.message });
      }
      req["userid"] = decoded.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { authenticate };
