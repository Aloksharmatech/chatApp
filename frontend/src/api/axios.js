import axios from "axios";

const API = axios.create({
    baseURL: "https://chat-backend-2b7d.onrender.com/api/",
    withCredentials: true
})

export default API;