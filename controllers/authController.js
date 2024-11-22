const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.registerUser = async (req, res, next) => {
  const verificationCode = generateVerificationCode();

  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
    });

    // Generate verification code

    // Compose email message
    const emailMessage = `
      You are receiving this email because you (or someone else) have registered using this email.\n\n
      Please use the following code to verify your account:\n\n
      ${verificationCode}\n\n
      If you did not request this, please ignore this email.\n
    `;

    // Attempt to send email
    try {
      await sendEmail({
        email: user.email,
        subject: "Account Verification Code",
        message: emailMessage,
      });

      // Send token if email was sent successfully
      return sendToken(user, 200, res); // Ensure this is the only response sent
    } catch (emailError) {
      // Handle email-sending errors
      return next(
        new ErrorHandler(
          `Failed to send verification email. Error: ${emailError.message}`,
          500
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

//login user
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    await sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//verify email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationCode } = req.body;
    if (!verificationCode) {
      return next(new ErrorHandler("Please provide verification code", 400));
    }

    const user = await User.findOneAndUpdate(
      { verificationCode },
      { $set: { emailVerified: 1, verificationCodeExpired: 1 } },
      { new: true }
    ).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid verification code", 400));
    }

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  } 
};



exports.getLogin = (req, res) => {
  res.render("index", { user: req.user });
};

exports.dashboard = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("templates/dashboard", { user: req.user });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
