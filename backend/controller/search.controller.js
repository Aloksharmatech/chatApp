const User = require("../models/User.model");

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user.id;

    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: currentUserId },
    })
      .limit(10)
      .select("username profilePicture");

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Search Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { searchUsers };
