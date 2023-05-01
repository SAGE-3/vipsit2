import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const dziPath = req.query.slug[0];
  console.log("dziPath", dziPath);
  const filePath = path.resolve(path.join("public", dziPath));
  const imageBuffer = fs.readFileSync(filePath);
  // res.setHeader("Content-Type", "application/xml");
  return res.send(imageBuffer);
}
