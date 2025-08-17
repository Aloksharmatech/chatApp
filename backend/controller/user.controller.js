const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const User = require("../models/User.model");

const editProfile = async (req, res) => {
  try {
    console.log("===== editProfile called =====");
    const id = req.user?.id;
    console.log("User ID from token:", id);

    const { username, bio } = req.body;
    const profilePicture = req.file;
    console.log("Received username:", username, "bio:", bio);
    console.log("Profile picture:", profilePicture ? profilePicture.originalname : "No file");

    if (!id) {
      console.error("No user ID found in request");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(id);
    if (!user) {
      console.error("User not found in DB");
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("User found:", user.username);

    let profilePictureUrl;

    if (profilePicture && profilePicture.buffer) {
      console.log("Processing profile picture...");

      // Delete old profile picture if exists
      if (user.profilePicture) {
        try {
          const segments = user.profilePicture.split("/");
          const publicIdWithExtension = segments[segments.length - 1];
          const publicId = publicIdWithExtension.split(".")[0];
          console.log("Deleting old Cloudinary image:", `chatApp_profilePictures/${publicId}`);
          await cloudinary.uploader.destroy(`chatApp_profilePictures/${publicId}`);
        } catch (err) {
          console.error("Error deleting old profile picture:", err);
        }
      }

      // Upload new profile picture
      profilePictureUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "chatApp_profilePictures" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            console.log("Cloudinary upload success:", result.secure_url);
            resolve(result.secure_url);
          }
        );
        streamifier.createReadStream(profilePicture.buffer).pipe(stream);
      });
    }

    // Build update object dynamically
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePictureUrl) updateData.profilePicture = profilePictureUrl;

    console.log("Updating user with data:", updateData);

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    console.log("Profile updated successfully:", updatedUser.username);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Server error in editProfile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { editProfile };
