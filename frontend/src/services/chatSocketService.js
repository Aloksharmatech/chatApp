import socket from "../socket/socket";

export const joinChat = (userId) => {
  socket.emit("join", userId);
};

export const sendMessage = (senderId, receiverId, text) => {
  socket.emit("sendMessage", { senderId, receiverId, text });
};
