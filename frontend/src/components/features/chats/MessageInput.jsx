import React, { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");

  function handleSend(e) {
    e.preventDefault();
    onSend(text);
    setText("");
  }

  return (
    <form
      onSubmit={handleSend}
      className="p-3 border-t border-gray-200 bg-white flex items-center gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 text-sm focus:outline-none"
      />
      <button
        type="submit"
        className="p-2 rounded-full bg-green-600 text-white hover:opacity-90"
      >
        <FiSend />
      </button>
    </form>
  );
}
