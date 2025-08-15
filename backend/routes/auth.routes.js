const express = require("express");
const {
  registerUser,
  verifyUser,
  loginUser,
  logOutUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} = require("../controller/auth.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post("/register", registerUser);
router.post("/verifyRegister", verifyUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", isAuthenticated, getCurrentUser);

module.exports = router;
