import React, { useState, useRef, useEffect } from "react";
import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ChatList from "./ChatList";
import { useQuery } from "@tanstack/react-query";
import API from "../../../api/axios";
import useSocket from "../../../hooks/useSocket";

export default function ChatSidebar({ className = "" }) {
  const socket = useSocket();

  const [isDraggable, setIsDraggable] = useState(false);
  const [width, setWidth] = useState(320);
  const startX = useRef(0);
  const startWidth = useRef(0);

  // Local state to manage conversations for real-time updates
  const [chats, setChats] = useState([]);

  // 🔹 Fetch conversations from backend
  const { data: conversations = [], isLoading, isError } = useQuery({
    queryKey: ["userConversations"],
    queryFn: async () => {
      const res = await API.get("message/");
      return res.data.data;
    },
  });

  // Sync initial fetch to local state
  useEffect(() => {
    setChats(conversations);
  }, [conversations]);

  // 🔹 Listen for new conversations via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewConversation = ({ conversation, message }) => {
      setChats((prev) => [conversation, ...prev]); // Add new conversation to top
    };

    socket.on("newConversation", handleNewConversation);

    return () => {
      socket.off("newConversation", handleNewConversation);
    };
  }, [socket]);

  function handleMouseDown(e) {
    startX.current = e.clientX;
    startWidth.current = width;
    setIsDraggable(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  }

  useEffect(() => {
    if (!isDraggable) return;

    function onMove(e) {
      const diff = e.clientX - startX.current;
      let newWidth = startWidth.current + diff;
      newWidth = Math.max(250, Math.min(newWidth, window.innerWidth / 2));
      setWidth(newWidth);
    }

    function onUp() {
      setIsDraggable(false);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isDraggable]);

  return (
    <aside
      style={{ width: `${width}px` }}
      className={`flex flex-col h-screen bg-white/90 border-r border-gray-200 relative shrink-0 ${className}`}
    >
      <SidebarHeader />
      <SearchBar />

      {isLoading ? (
        <p className="p-4 text-gray-500">Loading chats...</p>
      ) : isError ? (
        <p className="p-4 text-red-500">Failed to load chats</p>
      ) : (
        <ChatList chats={chats} /> 
      )}

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-gray-300/50"
      />
    </aside>
  );
}

