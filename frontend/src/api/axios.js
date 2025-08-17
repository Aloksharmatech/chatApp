import axios from "axios";

const API = axios.create({
    baseURL: "https://chatapp-backend-1s9x.onrender.com/api/",
    withCredentials: true
})

export default API;