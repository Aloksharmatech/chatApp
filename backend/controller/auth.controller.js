const User = require("../models/User.model");
const Otp = require("../models/Otp.model");
const { isDisposableEmail } = require("../utils/emailValidator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pendingUser } = require("../utils/pendingUser");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm password don't match",
      });
    }

    if (await isDisposableEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please use valid email address",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already used",
      });
    }

    const verificationOtp = Math.floor(100000 + Math.random() * 900000);

    pendingUser.set(email, {
      username,
      email,
      password: await bcrypt.hash(password, 10),
      verificationOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(email, verificationOtp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Please fill the otp",
      });
    }

    const pending = pendingUser.get(email);
    if (!pending) {
      return res.status(400).json({
        success: false,
        message: "No varification pending for this email",
      });
    }

    if (Date.now() > pending.expiresAt) {
      pendingUser.delete(email);
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (Number(otp) !== pending.verificationOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await User.create({
      username: pending.username,
      email: pending.email,
      password: pending.password,
    });

    pendingUser.delete(email);

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User doesn't exist please register",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .cookie("token", token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "None",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: "Login successful",
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const logOutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "None",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Provide the email first" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await Otp.create({
      email,
      otp,
      purpose: "passwordReset",
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "Reset Otp sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingOtp = await Otp.findOne({
      email,
      otp,
      purpose: "passwordReset",
    });
    if (!existingOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired otp",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOne({ email });
    user.password = hashPassword;
    await user.save();

    await Otp.deleteOne({ _id: existingOtp._id });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
