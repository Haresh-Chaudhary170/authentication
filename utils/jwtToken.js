const sendToken = async (user, statusCode, res) => {
    const token = await user.getJwtToken();
  
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    res.status(statusCode).cookie("token", token, cookieOptions).json({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  };
  module.exports = sendToken;