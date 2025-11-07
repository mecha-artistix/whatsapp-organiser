import { useEffect } from "react";
import socket from "./utils/socket";
import Whatsapp from "./features/whatsapp/Whatsapp.tsx";

// wsl ip 172.23.243.156

function App() {
  // const socketRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    socket.on("server_message", (server_message) =>
      console.log(server_message)
    );
  }, []);

  return (
    <div className="bg-gray-800 text-white min-h-screen p-8">
      <h1>HR Dashboard</h1>
      <Whatsapp />
    </div>
  );
}

export default App;
