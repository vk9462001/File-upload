require("dotenv").config();
const express = require("express");
const jimp = require("jimp");
const path = require("path");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

let filePath;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send({ message: "No files were uploaded." });
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.ufile;
  let uploadPath = __dirname + "/uploads/" + sampleFile.name;
  filePath = uploadPath;
  let directory = __dirname + "/uploads";

  fs.readdir(directory, (err, files) => {
    if (err) res.status(500).send({ error: err });

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) res.status(500).send({ error: err });
      });
    }
  });

  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send({ error: err });
    jimp.read(uploadPath, (err, lenna) => {
      if (err) res.status(500).send({ error: err });
      lenna
        .greyscale() // set greyscale
        .write(uploadPath); // save
    });
  });

  return res.status(200);
});

app.get("/download", function (req, res) {
  res.download(filePath, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening`);
});
