// client/src/utils/socket.js
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_IO_URL || "http://localhost:3001"
);

socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

socket.on("bidChange", (data) => {
  console.log("Received bidChange event:", data);
});

export default socket;
