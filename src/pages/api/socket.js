// import WebSocket, { WebSocketServer } from "ws";
import { WebSocketServer } from "ws";

const SocketHandler = (req, res) => {
  if (res.socket.server.ws) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const apiWebSocketServer = new WebSocketServer({
      server: res.socket.server,
      path: "/socket",
    });
    // const apiWebSocketServer = new WebSocketServer({ noServer: true });
    res.socket.server.ws = apiWebSocketServer;
    apiWebSocketServer.on("connection", (socket) => {
      console.log("Socket connected");
      socket.on("message", (msg) => {
        console.log("Message received>", msg.toString());
      });
    });
  }
  res.end();
};

export default SocketHandler;
