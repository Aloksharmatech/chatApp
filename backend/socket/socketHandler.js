function setUpSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 User connected", socket.id);




     // Get userId from query when client connects
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(userId); // Join a personal room for this user
      console.log(`User joined personal room: ${userId}`);
    }


    // Join conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
}

module.exports = { setUpSocket };
