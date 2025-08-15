const express = require("express");
const {
  sendMessage,
  startConversationAndSendMessage,
  getUserConversation,
  getMessages,
} = require("../controller/message.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();


// Start new conversation + send first message
router.post("/start", isAuthenticated, startConversationAndSendMessage);

// Send message in existing conversation
router.post("/:conversationId", isAuthenticated, sendMessage);

// Get all conversations of the logged-in user
router.get("/", isAuthenticated, getUserConversation);

// Get all messages of a conversation
router.get("/:conversationId/:id", isAuthenticated, getMessages);

module.exports = router;
