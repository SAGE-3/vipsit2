import { WebSocketServer } from "ws";
// import * as config from "next.config";

const SocketHandler = (req, res) => {
  if (res.socket.server.ws) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const basePath = "/vipsit";
    const apiWebSocketServer = new WebSocketServer({
      server: res.socket.server,
      path: basePath + "/socket",
    });
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
