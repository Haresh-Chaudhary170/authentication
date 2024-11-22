const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
    trim: true,
    maxlength: [30, "Name should not exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
    select:false
  },
  googleId: {
    type: String,
   },
  emailVerified: {
    type: Number,
    default: 0,
  },
  verificationCode: {
    type:Number,
    minlength:6,
    maxlength:6
  },
  codeExpired:{
    type: Number,
    default: 0
  }
  
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});


//compare user password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  //Return JWT token
  userSchema.methods.getJwtToken = async function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      }
    );
  };
  
module.exports = mongoose.model("User", userSchema);