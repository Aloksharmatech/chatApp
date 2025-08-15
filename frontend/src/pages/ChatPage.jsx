import React from "react";
import ChatWindow from "../components/features/chats/ChatWindow";

const ChatPage = ({ chat }) => {
  return (
    <div className="flex-1 bg-gray-100">
      <ChatWindow chat={chat} />
    </div>
  );
};

export default ChatPage;
