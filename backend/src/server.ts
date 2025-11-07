import express, { type Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import routes from "./routes.ts";
import registerWhatsappHandler from "./whatsapp.ts";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use("/", routes);

const httpServer: HTTPServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// registerWhatsappHandler(io);
registerWhatsappHandler();

export function startServer(): void {
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export { io, app, httpServer };
