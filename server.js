const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

const Bill = require("./models/Bill");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.billno + "-" + file.originalname);
  }
});

const app = express();
const upload = multer({ storage: fileStorage });

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/addbill", (req, res) => {
  res.render("addbill");
});

app.post("/addbill", upload.single("billfile"), (req, res) => {
  var newbill = new Bill({
    billno: req.body.billno,
    billfile: req.file.filename
  });
  newbill
    .save()
    .then(() => res.redirect("/addbill"))
    .catch(err => console.log(err));
});

app.get("/findbill", (req, res) => {
  res.render("findbill");
});

app.get("/findbillno", (req, res) => {
  Bill.findOne({ billno: req.query.billno })
    .then(data => {
      if (data === null) {
        return res.render("findbill", { error: "Bill not found" });
      } else {
        res.render("findbill", { file: data.billfile });
      }
    })
    .catch(err => console.log(err));
});

app.get("/filepdf", (req, res) => {
  const filename = req.query.filename;
  const filepath = path.join("uploads", filename);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.log(err);
      return res.send("no file found");
    }
    res.setHeader("Content-Type", "application/pdf");
    // res.setHeader("Content-Disposition", `inline; filename=${filename}`);
    res.send(data);
  });
});

const PORT = process.env.PORT || 8000;

mongoose.connect(
  "mongodb://user_1:user123@ds217976.mlab.com:17976/azhantraderstest",
  { useNewUrlParser: true }
);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
  console.log("DB connected");
});
