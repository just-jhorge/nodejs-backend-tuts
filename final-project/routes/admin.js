const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

router.get("/add-post", (req, res) => {
  res.sendFile(path.join(rootDir, "views", "add-post.html"));
});

router.post("/add-post", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
