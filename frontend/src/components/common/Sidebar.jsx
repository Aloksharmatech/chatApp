import React, { useState, useRef, useEffect } from "react";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { navItems } from "../../config/formSchema";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logOut } from "../../store/auth/auth-slice";
import {clearChat } from "../../store/chatselected/chat-slice"

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const sideBarRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(clearChat());
    navigate("/login");
  };

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
        setIsExpanded(false);
        setShowLabels(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  // Delay showing labels after expanding
  useEffect(() => {
    let timeout;
    if (isExpanded) {
      timeout = setTimeout(() => setShowLabels(true), 100);
    } else {
      setShowLabels(false);
    }
    return () => clearTimeout(timeout);
  }, [isExpanded]);

  return (
    <div
      ref={sideBarRef}
      className={`h-screen bg-[#2D5976] text-white p-2 flex flex-col justify-between transition-all duration-200 z-0 ${
        isExpanded ? "w-48" : "w-14"
      }`}
    >
      {/* Top Section */}
      <div>
        <button
          className="text-2xl mb-4 focus:outline-none hover:bg-[#1f3e53] p-2 rounded-lg"
          onClick={toggleSidebar}
        >
          <FiMenu />
        </button>

        <div>
          {navItems
            .filter((item) => item.position === "top")
            .map((item, index) => (
              <Link key={index} to={item.path}>
                <div className="flex items-center space-x-4 cursor-pointer hover:bg-[#1f3e53] p-2 rounded-lg transition">
                  <span className="text-2xl">{<item.icon />}</span>
                  {showLabels && (
                    <span className="text-md transition-opacity duration-300">
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* Bottom Section (Settings + Logout) */}
      <div className="flex flex-col space-y-2">
        {/* Settings from navItems */}
        {navItems
          .filter((item) => item.position === "bottom")
          .map((item, index) => (
            <Link key={index} to={item.path}>
              <div className="flex items-center space-x-4 cursor-pointer hover:bg-[#1f3e53] p-2 rounded-lg transition">
                <span className="text-2xl">{<item.icon />}</span>
                {showLabels && (
                  <span className="text-md transition-opacity duration-300">
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          ))}

        {/* Logout */}
        <div
          onClick={handleLogout}
          className="flex items-center space-x-4 cursor-pointer hover:bg-[#1f3e53] p-2 rounded-lg transition"
        >
          <span className="text-2xl">
            <FiLogOut />
          </span>
          {showLabels && (
            <span className="text-md transition-opacity duration-300">
              Logout
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
