import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [online, setOnline] = useState(false);
  const auth = useAuth();

  const user = auth?.user;
  const token = auth?.token;

  useEffect(() => {
    if (!token || !user) {
      // No token, don't connect
      return;
    }

    try {
      const newSocket = io("http://localhost:5000", {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("✅ Socket connected");
        setOnline(true);
      });

      newSocket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
        setOnline(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
        setOnline(false);
      });

      newSocket.on("user-connected", (data) => {
        console.log("👤 User connected:", data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
