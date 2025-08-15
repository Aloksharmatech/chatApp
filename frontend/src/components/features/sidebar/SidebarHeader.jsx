import React from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function SidebarHeader() {
  const { user } = useSelector((state) => state.auth);

  // Default anonymous avatar
  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <img
          src={user?.profilePicture || defaultAvatar}
          alt={user?.username || "Anonymous"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-semibold">
            {user?.username || "Unknown User"}
          </div>
          <div className="text-xs text-gray-500">Available</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-md hover:bg-gray-100">
          <FiMoreVertical />
        </button>
      </div>
    </div>
  );
}
