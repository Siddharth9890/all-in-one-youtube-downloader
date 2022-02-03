const mongoose = require("mongoose");

const userVideoSchema = mongoose.Schema({
  CountryName: {
    type: String,
  },
  City: {
    type: String,
  },
  State: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  IPV4: {
    type: String,
  },
  UserAgent: {
    type: String,
  },
  VideoTitle: {
    type: String,
  },
  ChannelName: {
    type: String,
  },
  VideoUrl: {
    type: String,
  },
  Downloaded: {
    type: Boolean,
    default: false,
  },
  Date: {
    type: Date,
    default: new Date().toISOString(),
  },
});

const UserVideoDetails = mongoose.model("userVideoDetails", userVideoSchema);

module.exports = UserVideoDetails;
