import { useEffect } from "react";
import WhatsappConnect from "./components/WhatsappConnect";
import socket from "../../utils/socket";
import { useState } from "react";

function Whatsapp() {
  // const [whatsappData, setWhatsappData] = useState(null);
  // const [status, setStatus] = useState("disconnected");
  const [qrCode, setQrCode] = useState("");
  const [id, setId] = useState("");
  useEffect(() => {
    const handleQr = (data: { id: string; qr: string }) => {
      if (data?.qr) {
        setQrCode(data.qr.trim());
        setId(data.id);
        console.log("QR Code received:", data);
      }
    };

    socket.on("qr", (data) => handleQr(data));
    socket.on("ready", (data) => {
      console.log("WhatsApp is ready:", data);
      // setWhatsappData(data);
    });

    socket.on("allChats", (data) => {
      console.log("All chats received:", data);
    });
  }, []);
  const getAllChats = () => {
    // socket.emit("getAllChats", { id });
    socket.emit("getAllChats", { id: "q" });
    console.log("Emitted getAllChats for id:", id);
  };
  return (
    <div>
      <WhatsappConnect qrCode={qrCode} />
      <button onClick={getAllChats}>Get Chats</button>
    </div>
  );
}

export default Whatsapp;
