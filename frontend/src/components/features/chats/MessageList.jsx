import React, { useEffect, useRef } from "react";

export default function MessageList({ messages, currentUserId }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
      {messages.map((msg) => {
        // If msg.message is an object, pull out the text field
        const messageText =
          typeof msg.message === "string" ? msg.message : msg.message?.message || "";

        const isCurrentUser =
          msg.sender &&
          (typeof msg.sender === "object"
            ? msg.sender._id === currentUserId
            : msg.sender === currentUserId);

        return (
          <div
            key={msg._id || `${msg.conversationId}-${msg.createdAt}`}
            className={`flex mb-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            {!isCurrentUser && (
              <img
                src={msg.sender?.profilePicture || "https://i.pravatar.cc/150?img=12"}
                alt="avatar"
                className="w-8 h-8 rounded-full mr-2 self-end"
              />
            )}

            <div className="flex flex-col max-w-xs">
              <div
                className={`px-4 py-2 rounded-xl break-words ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                }`}
              >
                <p className="text-sm">{messageText}</p>
              </div>
              <span
                className={`text-[10px] text-gray-400 mt-1 ${
                  isCurrentUser ? "text-right" : "text-left"
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {isCurrentUser && <div className="w-8 h-8 ml-2"></div>}
          </div>
        );
      })}
      <div ref={bottomRef}></div>
    </div>
  );
}
