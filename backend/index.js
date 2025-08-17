const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/DBConnection");
const { setUpSocket } = require("./socket/socketHandler");
require("dotenv").config();

// routes
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const searchRoutes = require("./routes/search.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/user", userRoutes);

setUpSocket(io);
app.set("io", io);

server.listen(process.env.PORT || 5000, () => {
  console.log("running..");
});
