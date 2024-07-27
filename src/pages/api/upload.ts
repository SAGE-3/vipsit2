import type { NextApiRequest, NextApiResponse } from "next";
import { parseForm } from "../../../lib/parse-form";
var sanitize = require("sanitize-filename");
import path from "path";
import { rename } from "fs";
import ChildProcess from "child_process";
import fs from "fs";
import formidable from "formidable";

var serverURL = process.env.SERVER_URL || "http://localhost:3000/";
// var serverURL = "http://localhost:3000/";

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
    const url = file.filepath;

    console.log("File> url", url);
    console.log("Got image upload> ", file.originalFilename, file.filepath);

    var newfilename = sanitize(file.originalFilename, { replacement: "_" }).replace(/ /g, "_");
    newfilename = newfilename.replace(/&/g, "_");
    var destination = path.join("uploads", newfilename);

    console.log("Moving file", file.filepath, "to", destination);

    rename(file.filepath, destination, function (err) {
      if (err) {
        console.log("Error> moving file", newfilename);
        res.status(500).json({ data: null, error: err.message });
      } else {
        console.log("File> moved to", destination);

        exifFile(destination, function (error: string | null, metadata: any) {
          if (error) {
            console.log("Error> metadata processing");
            res.status(500).json({ data: null, error: error });
          } else {
            console.log("EXIF>", metadata.FileName);
            console.log("EXIF>", metadata.FileType, metadata.MIMEType);
            console.log("EXIF>", metadata.ImageWidth, "x", metadata.ImageHeight);

            var basename = metadata.FileName.split(".")[0];

            // cleanup
            try {
              var cleanup = path.join("public", basename + ".dzi");
              fs.rmSync(cleanup);
              cleanup = path.join("public", basename + "_files");
              fs.rmSync(cleanup);
            } catch (e) {
              // ignore
            }

            vipsFile(destination, basename, function (error: string | null) {
              if (error) {
                console.log("Error> VIPS processing", error);
                res.status(500).send({ data: null, error: error });
              } else {
                var output = path.join("public", basename + ".dzi");
                console.log("VIPS> processing done", output);

                var dzi = dziFile(metadata.ImageWidth, metadata.ImageHeight, basename);
                fs.writeFileSync(output, dzi);
                res.status(200).send({ data: { url: "/" + basename + ".dzi" }, error: null });
              }
            });
          }
        });
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({ data: null, error: "Internal Server Error" });
  }
};

// Process the file with VIPS
function vipsFile(filename: string, basename: string, done: Function) {
  // vips dzsave filename ratbrain --layout dz --overlap 0 --tile-size 512 --suffix=.jpg\[Q=85\]

  var command;
  var output = path.join("public", basename);
  command = 'vips dzsave "' + filename + '" ' + output + " --layout dz --overlap 0 --tile-size 512 --suffix=.jpg";
  ChildProcess.exec(command, function (error) {
    if (error !== null) {
      done(error);
    } else {
      console.log("VIPS done", output);
      done(null);
    }
  });
}

// Generates a DZI file
function dziFile(width: number, height: number, name: string) {
  var dzi;

  dzi = '<?xml version="1.0" encoding="UTF-8"?>\n';
  dzi += '<Image xmlns="http://schemas.microsoft.com/deepzoom/2008"\n';
  dzi += 'Format="jpg"\n';
  dzi += 'Overlap="0"\n';
  dzi += 'TileSize="512"\n';
  dzi += 'Url="' + serverURL + name + '_files/"\n';
  dzi += ">\n";
  dzi += "<Size \n";
  dzi += 'Height="' + height + '"\n';
  dzi += 'Width="' + width + '"\n';
  dzi += "/>\n";
  dzi += "</Image>\n";

  return dzi;
}

// Extracts metadata from a file
function exifFile(filename: string, done: Function) {
  ChildProcess.exec('exiftool -m -json -filesize# -all "' + filename + '"', function (error, stdout, stderr) {
    var metadata;
    if (error !== null) {
      if (stdout && stderr.length === 0) {
        // There's some output, it might just be an unknown file type
        metadata = JSON.parse(stdout);
        if ("SourceFile" in metadata[0]) {
          if (metadata[0].Error) {
            // if there was an error because unknown file type, delete it
            delete metadata[0].Error;
          }
          // Add a dummy type
          metadata[0].MIMEType = "text/plain";
          metadata[0].FileType = "text/plain";
          done(null, metadata[0]);
        } else {
          // unknown data
          done(error.message);
        }
      } else {
        // No output, it's really an error
        done(error.message);
      }
    } else {
      metadata = JSON.parse(stdout);
      done(null, metadata[0]);
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
