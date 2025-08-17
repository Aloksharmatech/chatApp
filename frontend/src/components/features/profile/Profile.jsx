import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import API from "../../../api/axios";
import toast from "react-hot-toast";
import { getUser } from "../../../store/auth/auth-slice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(
    user?.profilePicture || "https://i.pravatar.cc/150?img=12"
  );
  const [isEditing, setIsEditing] = useState({ username: false, bio: false });
  const [isSaving, setIsSaving] = useState(false); // loading state

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (profilePicture) formData.append("profilePicture", profilePicture);

      const response = await API.put("/user/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(getUser());
      toast.success(response.data.message);

      setIsEditing({ username: false, bio: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-2 sm:px-3 md:px-12 py-3 gap-6 w-full max-w-2xl mx-auto">
      {/* Profile Picture */}
      <div className="relative flex flex-col items-center">
        <img
          src={preview}
          alt="Profile"
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-gray-300 shadow-sm"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <div
          onClick={() => fileInputRef.current.click()}
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition"
        >
          <FiEdit2 size={16} />
        </div>
      </div>

      {/* Username */}
      <div className="w-full flex flex-col gap-2 border-b border-gray-200 sm:py-2">
        <label className="text-sm font-medium text-gray-700">Username</label>
        <div className="flex items-center gap-2 w-full">
          {isEditing.username ? (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <span className="flex-1 text-gray-800 break-words">{username}</span>
          )}
          <button
            onClick={() =>
              setIsEditing((prev) => ({ ...prev, username: !prev.username }))
            }
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiEdit2 className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Bio */}
      <div className="w-full flex flex-col gap-2 sm:py-2 border-b border-gray-200">
        <label className="text-sm font-medium text-gray-700">Bio</label>
        <div className="flex items-start gap-2 w-full">
          {isEditing.bio ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          ) : (
            <span className="flex-1 text-gray-600 break-words">
              {bio || "No bio added yet"}
            </span>
          )}
          <button
            onClick={() =>
              setIsEditing((prev) => ({ ...prev, bio: !prev.bio }))
            }
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiEdit2 className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`mt-4 sm:mt-6 w-full sm:w-auto px-6 py-2 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition ${
          isSaving ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default Profile;
