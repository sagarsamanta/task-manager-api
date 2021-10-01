const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authentication = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisismynewcourse");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token, 
    });
    if (!user) {
      throw new Error();
    }
    req.token = token; //set token for other handelear can use
    req.user = user; //set reqest user to user other handelar .. they dont need to request again for all details about this user
    next();
  } catch (error) {
    res.status(500).send({ Error: "please authenticate!" });
  }
};
module.exports = authentication;
