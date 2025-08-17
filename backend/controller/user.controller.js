const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const User = require("../models/User.model");

const editProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { username, bio } = req.body;
    const profilePicture = req.file;

    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    let profilePictureUrl;

    if (profilePicture) {
      // 1. Delete old profile picture if exists
      if (user.profilePicture) {
        // Extract public_id from URL
        const segments = user.profilePicture.split("/");
        const publicIdWithExtension = segments[segments.length - 1]; // e.g. "abc123.jpg"
        const publicId = publicIdWithExtension.split(".")[0]; // remove extension
        await cloudinary.uploader.destroy(
          `chatApp_profilePictures/${publicId}`
        );
      }

      // 2. Upload new profile picture
      profilePictureUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "chatApp_profilePictures" },
          (error, result) => {
            if (error) return reject(error);
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

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { editProfile };