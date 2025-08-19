import React from "react";
import Sidebar from "../components/common/Sidebar";
import { Outlet } from "react-router-dom";
import ChatPage from "./ChatPage";
import EmptyChatWindow from "../components/common/EmptyChatWindow";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { chats } = useSelector((state) => state.account);


  return (
    <div className="flex flex-row min-h-screen bg-white">
      <Sidebar />

      <Outlet />

      <div className="flex-1">{chats ? <ChatPage /> : <EmptyChatWindow />}</div>
    </div>
  );
};

export default HomePage;
