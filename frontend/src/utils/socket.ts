// socket.js
import { io, Socket } from "socket.io-client";
// import type { DefaultEventsMap } from "@socket.io/component-emitter";

const socket: Socket = io("http://172.23.243.156:3000", {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
