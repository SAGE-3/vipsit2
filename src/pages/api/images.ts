import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ data: null, error: "Method Not Allowed" });
    return;
  }

  try {
    const imagelist: any[] = [];

    fs.readdir("public", function (err, list) {
      if (err) throw err;
      var regex = /\.dzi/;
      list.forEach(function (item) {
        if (regex.test(item)) {
          var basename = item.split(".")[0];
          var obj = {
            name: item,
            link: "/api/dzi-endpoint/" + item,
            image: "/api/images-endpoint/" + basename,
          };
          imagelist.push(obj);
        }
      });
      res.status(200).send({ data: imagelist, error: null });
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ data: null, error: "Internal Server Error" });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
