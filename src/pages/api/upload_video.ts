import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm, FormidableError } from "../../../lib/parse-form";
var sanitize = require("sanitize-filename");
import path from "path";
import { rename } from "fs";
import ChildProcess from "child_process";
import formidable from "formidable";

const handler = async (req: NextApiRequest, res: NextApiResponse<{ data: { url: string } | null; error: string | null }>) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ data: null, error: "Method Not Allowed" });
    return;
  }

  try {
    const { files } = await parseForm(req);

    if (Array.isArray(files)) {
      res.status(500).json({ data: null, error: "Multiple files not supported" });
      return;
    }
    const file = files.media as formidable.File;
    console.log("FILE", file.originalFilename, file.mimetype, file.size, file.filepath);
    const url = file.filepath;

    console.log("File> url", url);
    console.log("Got video upload> ", file.originalFilename, file.filepath);

    var newfilename = sanitize(file.originalFilename, { replacement: "_" }).replace(/ /g, "_");
    newfilename = newfilename.replace(/&/g, "_");
    const destination = "uploads";
    const inputname = path.join(destination, newfilename);
    const basename = path.basename(newfilename, path.extname(newfilename));
    console.log("Moving file", file.filepath, "to", destination);

    rename(file.filepath, inputname, function (err) {
      if (err) {
        console.log("Error> moving file", newfilename);
        res.status(500).json({ data: null, error: err.message });
      } else {
        console.log("File> moved to", destination);

        ffmpegFile(inputname, basename, "public", function (error: string | null, result: string | null) {
          if (error) {
            console.log("Error> video processing", error);
            res.status(500).json({ data: null, error: "Error: video processing" });
          } else {
            res.status(200).send({ data: { url: result||'null.mp4' }, error: null });
          }
        });
      }
    });
  } catch (e) {
    if (e instanceof FormidableError) {
      res.status(e.httpCode || 400).send({ data: null, error: e.message });
    } else {
      console.error(e);
      res.status(500).send({ data: null, error: "Internal Server Error" });
    }
  }
};

// Extracts metadata from a file
function ffmpegFile(fullname: string, basename: string, destination: string, done: Function) {
  const out = destination + "/" + basename + ".mp4";
  let command = 'ffmpeg -i "' + fullname + '"';
  command += " -c:v libx264 -b:v 6M -maxrate 8M -bufsize:v 12M ";
  command += " -preset slow -profile:v main -level 4.0 -c:a aac -b:a 128k -movflags +faststart -y ";
  // for vertial videos, need to swap width and height
  command += ' -vf "scale=min(iw\\,1920):min(1080\\,ih)" ';
  command += out;
  console.log("FFMPEG>", command);

  // var args = "-pix_fmt yuv420p -vcodec libx264 -preset medium -qp 18 -b:a 256K";
  // if (quality === "720p") {
  //   extras = " -b:v 3M -maxrate 6M -bufsize:v 6M ";
  //   scaling = '-vf "scale=min(iw\\,1280):min(720\\,ih)"';
  // } else if (quality === "1080p") {
  //   extras = " -b:v 6M -maxrate 8M -bufsize:v 12M ";
  //   scaling = '-vf "scale=min(iw\\,1920):min(1080\\,ih)"';
  // } else if (quality === "2160p") {
  //   extras = " -b:v 15M -maxrate 30M -bufsize:v 15M ";
  //   scaling = '-vf "scale=min(iw\\,3840):min(2160\\,ih)"';
  // }

  ChildProcess.exec(command, function (error, stdout) {
    if (error !== null) {
      done(error.message, null);
    } else {
      console.log("FFMPEG> stdout: ", stdout);
      done(null, basename + ".mp4");
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
