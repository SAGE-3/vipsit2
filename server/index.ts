import express, { Request, Response } from "express";
import next from "next";
// import * as config from "../next.config";

var cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
var serverPORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await app.prepare();
    const server = express();
    server.use(cors());
    server.use("/vipsit/assets", express.static("public"));
    // server.use(config.basePath + "/assets", express.static("public"));
    // server.use(express.static("public"));
    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
    server.listen(serverPORT, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${serverPORT} - env ${dev}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
