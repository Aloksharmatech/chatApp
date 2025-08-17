import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return; // prevent sending empty messages
    onSend(text);
    setText("");
  }

  return (
    <form
      onSubmit={handleSend}
      className="p-3 border-t border-gray-200 bg-white flex items-center gap-3 shadow-md"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 placeholder-gray-400"
      />
      <button
        type="submit"
        className="p-3 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white hover:scale-110 transform transition-all duration-200 shadow-lg flex items-center justify-center"
      >
        <FiSend size={18} />
      </button>
    </form>
  );
}
