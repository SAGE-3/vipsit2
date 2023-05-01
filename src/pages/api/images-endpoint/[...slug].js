import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const imagePath = req.query.slug;
  const filePath = path.resolve(path.join("public", imagePath + "_files/9/0_0.jpg"));
  const imageBuffer = fs.readFileSync(filePath);
  res.setHeader("Content-Type", "image/jpg");
  return res.send(imageBuffer);
}
