const express = require("express");
const { editProfile } = require("../controller/user.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/upload");

const router = express.Router();

router.put(
  "/update-profile",
  isAuthenticated,
  upload.single("profilePicture"),
  editProfile
);

module.exports = router;
