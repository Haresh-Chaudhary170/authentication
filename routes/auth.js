const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require("../controllers/authController");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/email-verify").post(verifyEmail);

module.exports = router;
