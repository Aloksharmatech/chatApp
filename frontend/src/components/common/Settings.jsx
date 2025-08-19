import React, { useState, useRef, useEffect } from "react";
import { FiChevronRight, FiArrowLeft } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../features/profile/Profile";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../store/auth/auth-slice";
import { clearChat } from "../../store/chatselected/chat-slice";

export default function Settings() {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(350);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isProfile, setIsProfile] = useState(false);

  const { user } = useSelector((state) => state.auth);

  function handleMouseDown(e) {
    startX.current = e.clientX;
    startWidth.current = width;
    setIsResizing(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  }

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(clearChat());
    navigate("/login");
  };

  useEffect(() => {
    if (!isResizing) return;

    function handleMouseMove(e) {
      const diff = e.clientX - startX.current;
      let newWidth = startWidth.current + diff;
      newWidth = Math.max(260, Math.min(newWidth, window.innerWidth / 2)); // min/max width
      setWidth(newWidth);
    }

    function handleMouseUp() {
      setIsResizing(false);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };
  }, [isResizing]);

  return (
    <aside
      style={{ width: `${width}px` }}
      className="flex flex-col h-screen bg-white border-r border-gray-200 relative shrink-0 shadow-sm transition-all"
    >
      {/* If isProfile true → show Profile UI, else show Settings UI */}
      {isProfile ? (
        <>
          {/* Profile Header */}
          <div className="flex items-center gap-3 p-2 border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setIsProfile(false)}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <FiArrowLeft className="text-gray-600" size={20} />
            </button>
            <h1 className="text-lg font-semibold">Profile</h1>
          </div>

          {/* Profile Component */}
          <div className="flex-1 overflow-y-auto">
            <Profile />
          </div>
        </>
      ) : (
        <>
          {/* Settings Header */}
          <div className="flex justify-center items-center p-4 text-lg font-semibold border-b border-gray-200 bg-gray-50">
            <h1>Settings</h1>
          </div>

          <div className="flex flex-col flex-1 p-3 gap-3 overflow-y-auto">
            {/* Profile Section */}
            <div
              onClick={() => setIsProfile(true)}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100 border border-gray-200 rounded-xl shadow-sm transition"
            >
              <img
                src={user.profilePicture || "https://i.pravatar.cc/150?img=12"}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border border-gray-300 shadow-sm"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold text-base">{user.username}</h3>
                <span className="text-sm text-gray-500">
                  {user.bio || "View Profile"}
                </span>
              </div>
              <FiChevronRight className="ml-auto text-gray-400" />
            </div>

            {/* Settings Options */}
            <div className="flex flex-col gap-1">
              {["Account", "Privacy", "Notifications", "Appearance"].map(
                (item, idx) => (
                  <button
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition"
                  >
                    {item}
                    <FiChevronRight className="text-gray-400" />
                  </button>
                )
              )}
            </div>

            {/* Logout */}
            <button
              className="mt-auto flex items-center justify-between px-3 py-3 text-sm text-red-500 font-medium rounded-lg hover:bg-red-50 transition"
              onClick={handleLogout}
            >
              Log out
              <FiChevronRight className="text-red-400" />
            </button>
          </div>
        </>
      )}

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-transparent hover:bg-gray-300/50"
      />
    </aside>
  );
}
