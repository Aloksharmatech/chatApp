import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function ChatHeader() {
  const { chats: chat } = useSelector((state) => state.account);
  
  if (!chat) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <img
          src={
            chat.participant?.profilePicture ||
            chat.profilePicture ||
            "https://i.pravatar.cc/150?img=12"
          }
          alt={chat.participant?.username || chat.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-semibold">
            {chat.participant?.username || chat.username}
          </div>
          <div className="text-xs text-gray-500">online</div>
        </div>
      </div>
      <button className="p-2 rounded-md hover:bg-gray-100">
        <FiMoreVertical />
      </button>
    </div>
  );
}
