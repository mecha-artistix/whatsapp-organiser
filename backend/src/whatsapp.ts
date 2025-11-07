import { fileURLToPath } from "url";
import path from "path";
import { io } from "./server.ts";
import type { Socket } from "socket.io";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import type { Client as ClientType } from "whatsapp-web.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const allSessionsObj: { [id: string]: ClientType } = {};
const sessionPath = path.resolve(__dirname, "../whatsapp_sessions");

const createWhatsappSession = (id: string, socket: Socket) => {
  if (allSessionsObj[id]) {
    console.log(`Session for ${id} already exists.`);
    socket.emit("ready");
    return;
  }

  console.log("createWhatsappSession called with id:", id);
  socket.emit("server_message", "Creating WhatsApp session...");

  const client = new Client({
    puppeteer: {
      headless: true,
      executablePath: "/usr/bin/chromium",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    },
    authStrategy: new LocalAuth({ clientId: id, dataPath: sessionPath }),
  });

  let isAuthenticated = false;

  client.on("qr", (qr) => {
    console.log(`QR RECEIVED ${id}`, qr);
    if (!isAuthenticated) {
      socket.emit("qr", { qr, id });
    }

    // qrcode.generate(qr, { small: true });
  });

  client.on("authenticated", () => {
    isAuthenticated = true;
    console.log("AUTHENTICATED");
  });
  client.on("ready", () => {
    console.log("ready");
    allSessionsObj[id] = client;
    socket.emit("ready");
  });

  client.initialize();
};

const registerWhatsappHandler = () => {
  io.on("connection", (socket) => {
    socket.on("createSession", (data) => {
      console.log("data for session create", data);
      const { id } = data;
      createWhatsappSession(id, socket);
    });
    socket.on("getAllChats", async ({ id }) => {
      console.log("getAllChats called for id:", id);
      const client = allSessionsObj[id];
      if (!client) {
        socket.emit("error", { message: "Client not ready" });
        return;
      }
      const chats = await client.getChats();
      socket.emit("allChats", chats);
    });
  });
};

export default registerWhatsappHandler;

// export default router;

/*
  try {
    client = new Client({
      authStrategy: new LocalAuth({
        clientId: "YOUR_CLIENT_ID", // Optional: Use different client IDs for multiple sessions
        dataPath: "./.wwebjs_auth", // Specify where to save session
      }),
      puppeteer: {
        headless: true,
      },
    });

    client.on("qr", (qr) => {
      console.log("🔄 Scan this QR code:");
      // qrcode.generate(qr, { small: true });
      console.log(qr);
      io.emit("qr", qr);
    });

    client.on("authenticated", () => {
      console.log("✅ Authentication successful!");
    });

    client.on("auth_failure", (msg) => {
      console.error("❌ Authentication failed:", msg);
      isInitializing = false;
    });

    client.on("ready", async () => {
      console.log("✅ WhatsApp Connected");
      isInitializing = false;

      // Don't block the ready event - run async
      setTimeout(async () => {
        try {
          console.log("🔄 Step 1: Fetching chats list...");
          const startTime = Date.now();

          const chats = await client.getChats();
          console.log(
            `📂 Step 1 Complete: Found ${chats.length} chats (took ${
              Date.now() - startTime
            }ms)`
          );

          if (chats.length === 0) {
            console.log(
              "⚠️ No chats found. Make sure you have WhatsApp conversations."
            );
            return;
          }

          // Log all chat names first
          console.log("\n📋 Chat List:");
          chats.forEach((chat, i) => {
            console.log(
              `  ${i + 1}. ${chat.name || chat.id.user} (${
                chat.id._serialized
              })`
            );
          });

          console.log(
            `\n🔄 Step 2: Fetching messages from ${chats.length} chats...\n`
          );

          // Now fetch messages one by one
          let totalMessages = 0;
          for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            try {
              const fetchStart = Date.now();
              const messages = await chat.fetchMessages({ limit: 50 });
              totalMessages += messages.length;

              console.log(
                `✅ [${i + 1}/${chats.length}] ${chat.name || chat.id.user}: ${
                  messages.length
                } messages (${Date.now() - fetchStart}ms)`
              );

              // Optional: Show first message as sample
              if (messages.length > 0) {
                const firstMsg = messages[messages.length - 1]; // oldest message
                console.log(
                  `   └─ Oldest: "${
                    firstMsg.body?.substring(0, 50) || "[media]"
                  }..."`
                );
              }
            } catch (chatErr) {
              console.error(
                `❌ [${i + 1}/${chats.length}] Error fetching from ${
                  chat.id.user
                }:`,
                chatErr.message
              );
            }

            // Small delay between fetches to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          console.log(
            `\n✅ Step 2 Complete! Total: ${totalMessages} messages from ${chats.length} chats`
          );
        } catch (err) {
          console.error("❌ Error in sync process:", err);
          console.error("Stack:", err.stack);
        }
      }, 2000); // Wait 2 seconds after ready
    });

    client.on("message", async (message) => {
      console.log("📩 New message from:", message.from);
      console.log("💬 Content:", message.body);
    });

    client.on("disconnected", (reason) => {
      console.log("⚠️ Client disconnected:", reason);
      client = null;
      isInitializing = false;
    });

    await client.initialize();

    res.json({
      status: "connecting",
      message: "WhatsApp client is initializing. Check console for QR code.",
    });
  } catch (error) {
    console.error("❌ Error initializing client:", error);
    isInitializing = false;
    client = null;
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }


  // Optional: Add a status endpoint
router.get("/status", (req, res) => {
  if (!client) {
    return res.json({ status: "disconnected" });
  }

  res.json({
    status: client.info ? "connected" : "connecting",
    info: client.info || null,
  });
});

// Optional: Add a logout endpoint
router.post("/logout", async (req, res) => {
  if (!client) {
    return res.status(400).json({
      status: "error",
      message: "No active client",
    });
  }

  try {
    await client.logout();
    await client.destroy();
    client = null;
    res.json({ status: "logged_out" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
*/
