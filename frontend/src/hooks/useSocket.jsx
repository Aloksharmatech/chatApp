import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { setOnlineUsers } from "../store/onlineUsers/online-slice";

export default function useSocket() {
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const s = io("https://chatapp-backend-1s9x.onrender.com", {
        withCredentials: true,
        query: { userId: user.id },
      });
      setSocket(s);

      // Now backend sends { users, lastSeen }
      s.on("onlineUsers", (data) => {
        console.log("Online users update:", data);
        dispatch(setOnlineUsers(data));
      });

      return () => {
        s.disconnect();
      };
    }
  }, [user, dispatch]);

  return socket;
}
