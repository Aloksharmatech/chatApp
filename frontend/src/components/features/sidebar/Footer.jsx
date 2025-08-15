import React from "react";
import { FiPlus } from "react-icons/fi";

export default function Footer({ isCollapsed }) {
  return (
    <div className="px-3 py-3 border-t border-gray-100">
      <div
        className={`flex items-center justify-between ${
          isCollapsed ? "flex-col gap-2" : ""
        }`}
      >
        {!isCollapsed && (
          <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:opacity-95">
            <FiPlus /> New chat
          </button>
        )}
        {isCollapsed && (
          <button
            className="p-2 rounded-full bg-green-600 text-white"
            title="New chat"
          >
            <FiPlus />
          </button>
        )}
        {!isCollapsed && (
          <div className="text-xs text-gray-500">Last seen today</div>
        )}
      </div>
    </div>
  );
}
