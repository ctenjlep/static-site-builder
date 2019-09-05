let express = require("express");
let app = express();
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads/" });
let MongoClient = require("mongodb").MongoClient;
app.use("/uploads", express.static("uploads"));
let reloadMagic = require("./reload-magic.js");
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let dbo = undefined;
reloadMagic(app);
let url =
  "mongodb+srv://bob:bobsue@cluster0-ox79k.mongodb.net/test?retryWrites=true&w=majority";

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  if (err) {
    console.log(err);
  }
  dbo = db.db("static-site-builder");
});
// Your endpoints go after this line

app.post("/signup", upload.none(), (req, res) => {
  let usernameEntered = req.body.username;
  let pwd = req.body.password;
  dbo
    .collection("users")
    .findOne({ username: usernameEntered }, (err, user) => {
      ///handles error
      if (err) {
        console.log("an error occured");
        res.send(JSON.stringify({ success: false, msg: "error" }));
        return;
      }
      //handles user existing
      if (user !== null) {
        console.log("this user already exists");
        res.send(JSON.stringify({ success: false, msg: "user-exists" }));
        return;
      }
      //success case - the user doesn't exists yet, we insert into collection
      if (user === null) {
        console.log("username available");
        dbo.collection("users").insertOne({
          username: usernameEntered,
          password: pwd,
          purchaseHistory: [],
          cart: {}
        });
        let sessionId = generateID();
        dbo
          .collection("sessions")
          .insertOne({ username: usernameEntered, sessionId: sessionId });
        res.cookie("sid", sessionId);
        res.send(JSON.stringify({ success: true }));
        return;
      }
      res.send(JSON.stringify({ success: false }));
    });
});

app.post("/login", upload.none(), (req, res) => {
  console.log("request to login");
  let usernameEntered = req.body.username;
  let pwd = req.body.password;
  dbo
    .collection("users")
    .findOne({ username: usernameEntered }, (err, user) => {
      if (err) {
        res.send(JSON.stringify({ success: false }));
        return;
      }
      ///user doesn't exist
      if (user === null) {
        res.send(JSON.stringify({ success: false, msg: "invalid-user" }));
        return;
      }
      if (user.password === pwd) {
        ////password matches
        let sessionId = generateID();
        dbo
          .collection("sessions")
          .insertOne({ username: usernameEntered, sessionId: sessionId });
        res.cookie("sid", sessionId);
        res.send(JSON.stringify({ success: true }));
        return;
      }
      res.send(JSON.stringify({ success: false }));
    });
});

// all-items endpoint
app.get("/all-sites", (req, res) => {
  console.log("request to /all-sites endpoint");
  dbo
    .collection("sites")
    .find({})
    .toArray((err, sites) => {
      if (err) {
        console.log("ERROR", err);
        res.send(JSON.stringify({ success: false }));
        return;
      }
      res.send(JSON.stringify(sites));
    });
});

app.post("/site-save", upload.none(), (req, res) => {
  console.log("request to site-save");
  let enteredUsername = req.body.username;
  let siteName = req.body.siteName;
  let siteObj = JSON.parse(req.body.siteObj);
  console.log("request to site-save");
  console.log("submitted site", siteObj);

  dbo
    .collection("sites")
    .findOne({ username: enteredUsername, siteName: siteName }, (err, site) => {
      ///handles error
      if (err) {
        console.log("an error occured");
        res.send(JSON.stringify({ success: false, msg: "error" }));
        return;
      }
      //handles user existing
      if (site !== null) {
        console.log("overwriting previous save point");
        dbo.collection("sites").replaceOne(
          {
            username: user,
            siteName: siteName
          },
          {
            username: user,
            siteName: siteName,
            siteObject: siteObj
          }
        );
        res.send(JSON.stringify({ success: true, msg: "site-updated" }));
        return;
      }
      //success case - the user doesn't exists yet, we insert into collection
      if (site === null) {
        console.log("submitting new site");
        dbo.collection("sites").insertOne({
          username: enteredUsername,
          siteName: siteName,
          siteObject: siteObj
        });
        res.send(JSON.stringify({ success: true }));
        return;
      }
      res.send(JSON.stringify({ success: false }));
    });
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});

let findUsernameByCookie = async cookie => {
  let user = await dbo
    .collection("sessions")
    .findOne({ sessionId: cookie }, { user: 1 });
  return user.username;
};

let generateID = () => {
  return "" + Math.floor(Math.random() * 1000000000);
};
