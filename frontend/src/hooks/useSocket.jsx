import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const { user } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  console.log("user id",user.id);

  useEffect(() => {
    if (user) {
      const s = io("http://localhost:5000", {
        withCredentials: true,
        query: { userId: user.id },
      });
      setSocket(s);

      return () => s.disconnect();
    }
  }, [user]);

  return socket;
}
