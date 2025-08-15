import React from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="px-3 py-3 border-b border-gray-100">
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <FiSearch />
        </span>
        <input
          value={value}
          onChange={onChange}
          placeholder="Search or start new chat"
          className="w-full pl-10 pr-3 py-2 rounded-full bg-gray-100 text-sm focus:outline-none"
          aria-label="Search chats"
        />
      </div>
    </div>
  );
}
