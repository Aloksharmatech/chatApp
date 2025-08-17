import React, { useEffect, useState } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { useQuery } from "@tanstack/react-query";
import API from "../../../api/axios";
import useSocket from "../../../hooks/useSocket";
import { useSelector } from "react-redux";

export default function ChatWindow() {
  const socket = useSocket();

  const { chats: chat } = useSelector((state) => state.account);

  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(
    chat?.conversationId || null
  );
  const [receiverId, setReceiverId] = useState(chat?._id || null);

  useEffect(() => {
    setConversationId(chat?.conversationId || null);
    setReceiverId(chat?._id || null);
    setMessages([]);
  }, [chat]);

  // Fetch messages only for existing conversations
  const { isLoading, isError } = useQuery({
    queryKey: ["messages", receiverId, conversationId],
    queryFn: async () => {
      const res = await API.get(
        `message/${conversationId || "aa"}/${receiverId || "aa"}`
      );
      setMessages(res.data.data || []);
      return res.data.data || [];
    },
    enabled: !!receiverId || !!conversationId,
  });

  // ✅ Join conversation socket room & listen for new messages
  useEffect(() => {
    if (!conversationId || !socket) return;

    socket.emit("joinConversation", conversationId);

    const handleReceive = (newMessage) => {
      console.log("new message", newMessage);
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [conversationId, socket]);

  async function handleSendMessage(text) {
    if (!text.trim()) return;

    let res;

    if (!conversationId) {
      // New chat — start conversation
      res = await API.post(`message/start`, {
        receiverId,
        message: text,
      });

      setConversationId(res.data.conversationId);
      setMessages([res.data.message]);

      socket.emit("joinConversation", res.data.conversationId);
    } else {
      // Existing conversation
      res = await API.post(`message/${conversationId}`, { message: text });
    }
  }

  console.log("messagess", messages);

  if (!chat) {
    return (
      <div className="flex flex-col h-screen flex-1">
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to start chatting
        </div>
        <MessageInput onSend={handleSendMessage} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen flex-1">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">Loading messages...</div>
        ) : isError ? (
          <div className="p-4 text-center text-red-500">
            Failed to load messages
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            No messages yet
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      <div className="border-t">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
