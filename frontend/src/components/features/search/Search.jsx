import React, { useState, useRef, useEffect } from "react";
import SearchBar from "../sidebar/SearchBar";
import API from "../../../api/axios";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setChats } from "../../../store/chatselected/chat-slice";

export default function Search({ className = "" }) {
  const [isDraggable, setIsDraggable] = useState(false);
  const [width, setWidth] = useState(320);
  const [query, setQuery] = useState("");
  const startX = useRef(0);
  const startWidth = useRef(0);

  const dispatch = useDispatch();

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const res = await API.get(`/search/users?query=${query}`);
      return res.data.data;
    },
    enabled: !!query,
    staleTime: 0,
    cacheTime: 0,
  });

  // Debounce query input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        refetch();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, refetch]);

  // Handle sidebar resizing
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
      {/* Header */}
      <div className="flex justify-center items-center p-4 text-lg font-semibold border-b border-gray-200 bg-gray-50">
        <h1>Find Friends</h1>
      </div>

      {/* Search Input */}
      <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />

      {/* User List */}
      {isLoading ? (
        <p className="p-4 text-gray-500 text-center">Searching users...</p>
      ) : isError ? (
        <p className="p-4 text-red-500 text-center">Failed to load users</p>
      ) : users.length === 0 ? (
        <p className="p-4 text-gray-500 text-center">Search Users</p>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100"
              onClick={() => dispatch(setChats(user))}
            >
              <img
                src={user.profilePicture || "https://i.pravatar.cc/150?img=12"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-gray-300/50"
      />
    </aside>
  );
}
