const express = require("express");
const {
  validateLink,
  downloadVideo,
} = require("../controller/youtube.controller");

const router = express.Router();

router.post("/validate-link/:id", validateLink);

router.post("/download-video/:id/:itag", downloadVideo);

module.exports = router;
