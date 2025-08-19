import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function MessageList({ messages }) {
  const { user } = useSelector((state) => state.auth);

  const currentUserId = user.id;
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
      {messages.map((msg) => {
        const messageText =
          typeof msg.message === "string"
            ? msg.message
            : msg.message?.message || "";

        const isCurrentUser =
          msg.sender &&
          (typeof msg.sender === "object"
            ? msg.sender._id === currentUserId
            : msg.sender === currentUserId);

        return (
          <div
            key={msg._id || `${msg.conversationId}-${msg.createdAt}`}
            className={`flex mb-3 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar for received messages */}
            {!isCurrentUser && (
              <img
                src={
                  msg.sender?.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="avatar"
                className="w-8 h-8 rounded-full mr-2 self-end"
              />
            )}

            {/* Message bubble */}
            <div className="flex flex-col max-w-xs">
              <div
                className={`px-4 py-2 rounded-xl break-words ${
                  isCurrentUser
                    ? "bg-blue-500 text-white rounded-tr-none rounded-bl-xl"
                    : "bg-white text-gray-800 rounded-tl-none rounded-br-xl border border-gray-200"
                }`}
              >
                <p className="text-sm">{messageText}</p>
              </div>

              {/* Timestamp */}
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

            {/* Placeholder for sender messages to keep spacing */}
            {isCurrentUser && <div className="w-8 h-8 ml-2"></div>}
          </div>
        );
      })}
      <div ref={bottomRef}></div>
    </div>
  );
}
