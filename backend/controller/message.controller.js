const User = require("../models/User.model");
const Message = require("../models/Message.model");
const Conversation = require("../models/Conversation.model");

const startConversationAndSendMessage = async (req, res) => {
  try {
    const senderUserId = req.user.id;
    const { receiverId, message } = req.body;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and message are required",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderUserId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderUserId, receiverId],
      });
    }

    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender: senderUserId,
      receiver: receiverId,
      message,
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture");

    console.log(receiverId);

    const io = req.app.get("io");
    io.to(receiverId).emit("receiveMessage", {
      conversation,
      message: populatedMessage,
    });

    return res.status(201).json({
      success: true,
      conversationId: conversation._id,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Start Conversation Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const senderUserId = req.user.id;
    const { message } = req.body;
    const { conversationId } = req.params;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const receiverUserId = conversation.participants.find(
      (id) => id.toString() !== senderUserId
    );

    const newMessage = await Message.create({
      conversationId,
      sender: senderUserId,
      receiver: receiverUserId,
      message,
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture");

    const io = req.app.get("io");
    io.to(conversationId).emit("receiveMessage", populatedMessage);

    return res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending the message",
    });
  }
};

const getUserConversation = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate({
        path: "participants",
        match: { _id: { $ne: currentUserId } }, // exclude logged-in user
        select: "username profilePicture",
      })
      .populate({
        path: "lastMessage",
        select: "message sender createdAt",
        populate: { path: "sender", select: "username profilePicture" },
      })
      .sort({ updatedAt: -1 });

    // attach the single other participant for frontend convenience
    const formattedConversations = conversations.map((conv) => {
      const obj = conv.toObject();
      delete obj._id; // remove default _id

      return {
        ...obj,
        conversationId: conv._id,
        participant: conv.participants[0] || null,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedConversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching conversations",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const conversationId = req.params.conversationId;
    const targetUserId = req.params.id;

    if (conversationId != "aa") {
      const messages = await Message.find({ conversationId })
        .populate("sender", "username profilePicture")
        .populate("receiver", "username profilePicture")
        .sort({ createdAt: 1 });

      return res.status(200).json({
        success: true,
        data: messages,
      });
    } else {
      // if conversationId is not there then
      const conversation = await Conversation.findOne({
        participants: { $all: [currentUserId, targetUserId] },
      });

      if (!conversation) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      const messages = await Message.find({ conversationId: conversation._id })
        .populate("sender", "username profilePicture")
        .populate("receiver", "username profilePicture")
        .sort({ createdAt: 1 });

      return res.status(200).json({
        success: true,
        data: messages,
      });
    }
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching messages",
    });
  }
};

module.exports = {
  sendMessage,
  getUserConversation,
  getMessages,
  startConversationAndSendMessage,
};
