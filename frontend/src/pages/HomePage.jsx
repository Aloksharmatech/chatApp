import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";
import ChatPage from "./ChatPage";
import EmptyChatWindow from "../components/common/EmptyChatWindow";

const HomePage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex flex-row min-h-screen bg-white">
      <Sidebar />

      <Outlet context={{ setSelectedChat }} />

      <div className="flex-1">
        {selectedChat ? (
          <ChatPage chat={selectedChat} />
        ) : (
          <EmptyChatWindow />
        )}
      </div>
      
    </div>
  );
};

export default HomePage;
















