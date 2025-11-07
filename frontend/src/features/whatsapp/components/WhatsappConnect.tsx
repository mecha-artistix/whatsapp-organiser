import QRCode from "react-qr-code";
import socket from "../../../utils/socket";
import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";

function WhatsappConnect({ qrCode }: { qrCode: string }) {
  // const [status, setStatus] = useState("disconnected");
  const [session, setSession] = useState("");

  const connectWhatsApp = async () => {
    socket.emit("createSession", { id: session });
  };
  return (
    <>
      <input
        type="text"
        placeholder="Session Name"
        value={session}
        onChange={(e) => setSession(e.target.value)}
      />
      <Button onClick={connectWhatsApp}>Connect WhatsApp</Button>

      <div style={{ background: "white", padding: "16px" }}>
        <QRCode value={qrCode} />
      </div>
      <p>Status: </p>
    </>
  );
}

export default WhatsappConnect;
