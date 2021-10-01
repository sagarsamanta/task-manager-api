const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email address");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate(value) {
      if (value.toLowerCase().includes("Password")) {
        throw new Error('Password cannot contain "password"');
            }
    },
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive number");
      }
    },
    default: 0,
  },
  avatar:{
    type:Buffer
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
 
});


userSchema.virtual('tasks', {
  ref: 'Tasks',
  localField: '_id',
  foreignField: 'owner'
})

//toJSON() call when you call res.send method with object to user then internally this
//  send method call JSON.stringify to convet the result to json and send responce to 
// user and this json.stringify intenally call toJSON() with calling object so, when you call res.send(Objjcet) this function automaticall called


// sending the data which user can see about her details exculude password and token ,token also send as object as responce but not send when user see his details

userSchema.methods.toJSON = function () { // call come from login page as confermation to user
  // userSchema.methods.filterObject=function(){ // you can use genral function like i name this filterObject but you have to call this with same name also to execute it
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject

}
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() },JWT_SECREAT_KEY);
  user.tokens = user.tokens.concat({ token: token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new Error("Unable to login !");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login !");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
