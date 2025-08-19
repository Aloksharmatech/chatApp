const onlineUsers = new Map(); // userId -> socketId
const lastSeen = new Map();    // userId -> timestamp

function setUpSocket(io) {
  io.on("connection", (socket) => {
    console.log(" User connected", socket.id);

    // Get userId from query when client connects
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(userId); // personal room
      onlineUsers.set(userId, socket.id);
      lastSeen.delete(userId); // remove old lastSeen since user is online now

      console.log(`✅ User ${userId} is ONLINE`);

      // Send full online + lastSeen state
      io.emit("onlineUsers", {
        users: Object.fromEntries(onlineUsers),
        lastSeen: Object.fromEntries(lastSeen),
      });
    }

    // Join conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);

      for (let [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) {
          onlineUsers.delete(uid);
          lastSeen.set(uid, new Date().toISOString()); // save last seen time

          
          console.log(`🚪 User ${uid} is OFFLINE at ${lastSeen.get(uid)}`);
          break;
        }
      }

      // Send full online + lastSeen state again
      io.emit("onlineUsers", {
        users: Object.fromEntries(onlineUsers),
        lastSeen: Object.fromEntries(lastSeen),
      });
    });
  });
}

module.exports = { setUpSocket, onlineUsers, lastSeen };
