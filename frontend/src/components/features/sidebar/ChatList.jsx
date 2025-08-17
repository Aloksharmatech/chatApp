import React from "react";
// import { useOutletContext } from "react-router-dom";
import { setChats } from "../../../store/chatselected/chat-slice";
import { useDispatch } from "react-redux";

const DEFAULT_AVATAR =  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function ChatList({ chats }) {

  const dispatch = useDispatch();

  return (
    <div className="flex-1 overflow-auto">
      <ul className="divide-y divide-gray-100">
        {chats.map((chat) => {
          const otherUser = chat.participant;

          return (
            <li
              key={chat.conversationId}
              onClick={() => dispatch(setChats(chat))}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-gray-50"
              title={otherUser?.username || "Unknown"}
            >
              <img
                src={otherUser?.profilePicture || DEFAULT_AVATAR}
                alt={otherUser?.username || "Anonymous"}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => (e.target.src = DEFAULT_AVATAR)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium truncate">
                    {otherUser?.username || "Unknown"}
                  </h4>
                  <span className="text-xs text-gray-400 ml-2">
                    {chat.lastMessage?.createdAt
                      ? new Date(
                          chat.lastMessage.createdAt
                        ).toLocaleTimeString()
                      : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <p className="truncate">{chat.lastMessage?.message || ""}</p>
                  {chat.unread > 0 && (
                    <span className="ml-3 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500 text-white">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        {chats.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-gray-500">
            No chats found
          </li>
        )}
      </ul>
    </div>
  );
}
