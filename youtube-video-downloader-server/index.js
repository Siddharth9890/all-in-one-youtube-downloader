const express = require("express");
const youtubeDownloaderRouter = require("./routes/youtubeDownloader.routes");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const app = express();

const limiter = rateLimiter({
  max: 2,
  windowMs: 1 * 60 * 1000,
  handler: function (req, res, next) {
    return res.status(429).json({
      error: "You sent too many requests. Please wait a while then try again",
    });
  },
});

app.use("/api", limiter);
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use(cors("http://localhost:3000/"));
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("db connected 😊");
});
app.use("/api/youtube-downloader/", youtubeDownloaderRouter);

app.listen(PORT, () => console.log("Server running on port " + PORT));
