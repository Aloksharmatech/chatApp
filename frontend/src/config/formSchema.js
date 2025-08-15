import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { FiMessageCircle, FiSearch } from "react-icons/fi";
import { MdSecurity } from "react-icons/md";

export const signUpFields = [
  {
    name: "username",
    placeholder: "Username",
    type: "text",
    required: true,
    icon: FaUser,
  },
  {
    name: "email",
    placeholder: "Email",
    type: "email",
    required: true,
    icon: FaEnvelope,
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
    required: true,
    icon: FaLock,
  },
  {
    name: "confirmPassword",
    placeholder: "Confirm Password",
    type: "password",
    required: true,
    icon: FaLock,
  },
  {
    name: "otp",
    placeholder: "Enter Otp",
    type: "text",
    required: true,
    icon: MdSecurity,
  },
];

export const signInFields = [
  {
    name: "email",
    placeholder: "Email",
    type: "email",
    required: true,
    icon: FaEnvelope,
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
    required: true,
    icon: FaLock,
  },
];

export const navItems = [
  { name: "Chat", icon: FiMessageCircle, path: "/home" },
  { name: "Search", icon: FiSearch, path: "/home/search" },
];