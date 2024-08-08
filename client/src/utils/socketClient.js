// client/src/utils/socketClient.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Replace with your Socket.IO server URL

socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket;
