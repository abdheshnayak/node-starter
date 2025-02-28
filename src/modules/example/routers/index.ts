import fs from "node:fs";
import path from "node:path";

import { Router } from "express";
import { UploadedFile } from "express-fileupload";

import { _dirname } from "~/lib/node-utils";


const router = Router();


router.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  const uploadedFile = req.files.file as UploadedFile;

  fs.mkdir("/tmp/uploads", { recursive: true }, (err) => {
    if (err) return res.status(500).send(err);
  });

  // Move the file to a desired directory
  uploadedFile.mv(path.join("/tmp", "uploads", uploadedFile.name), (err) => {
    if (err) return res.status(500).send(err);

    res.send("File uploaded successfully!");
  });

});


export default router;
