const fs = require("fs");
const ytdl = require("ytdl-core");
const UserVideoDetails = require("../models/userVideoModel");

async function validateLink(request, response) {
  const id = request.params.id;
  const { country_name, city, state, latitude, longitude, IPv4, userData } =
    request.body;
  if (!id) return response.status(401).send("id cannot be empty");
  try {
    const result = ytdl.validateID(id);
    if (result === true) {
      const { videoDetails, formats } = await ytdl.getBasicInfo(
        `https://www.youtube.com/watch?v=${id}`
      );
      const { title, ownerChannelName } = videoDetails;
      await UserVideoDetails.create({
        CountryName: country_name,
        City: city,
        State: state,
        latitude: latitude,
        longitude: longitude,
        IPV4: IPv4,
        UserAgent: userData,
        VideoTitle: title,
        VideoUrl: `https://www.youtube.com/watch?v=${id}`,
        ChannelName: ownerChannelName,
      });
      let format = [];
      formats.forEach((videoFormat) => {
        if (!(videoFormat.mimeType === 'video/webm; codecs="vp9"')) {
          if (!(videoFormat.mimeType === 'audio/webm; codecs="opus"'))
            format.push(videoFormat);
        }
      });
      return response.status(200).send({
        title,
        ownerChannelName,
        format,
      });
    }
    response.status(200).send(result);
  } catch (error) {
    response.status(500).send(error);
  }
}

async function downloadVideo(request, response) {
  const id = request.params.id;
  const itag = request.params.itag;
  const { country_name, city, state, latitude, longitude, IPv4, userData } =
    request.body;
  if (!id || !itag)
    return response.status(401).send("id or itag cannot be empty");
  try {
    const { formats, videoDetails } = await ytdl.getBasicInfo(
      `https://www.youtube.com/watch?v=${id}`
    );
    const { title, ownerChannelName } = videoDetails;

    await UserVideoDetails.create({
      CountryName: country_name,
      City: city,
      State: state,
      latitude: latitude,
      longitude: longitude,
      IPV4: IPv4,
      UserAgent: userData,
      VideoTitle: title,
      VideoUrl: `https://www.youtube.com/watch?v=${id}`,
      ChannelName: ownerChannelName,
      Downloaded: true,
    });
    let finalItag = [];
    formats.forEach((format) => {
      if (parseInt(itag) === format.itag) {
        finalItag.push(format);
      }
    });
    downloadVideoHelper(response, id, finalItag[0].itag);
  } catch (error) {
    response.status(500).send(error);
  }
}

function downloadVideoHelper(response, id, quality) {
  const video = ytdl(`http://www.youtube.com/watch?v=${id}`, {
    quality,
  });
  video.on("progress", function (info) {});
  video.on("end", function (info) {
    response.status(200).download(`${__dirname}/../video.mp4`);
  });
  video.pipe(fs.createWriteStream("video.mp4"));
}

module.exports = {
  validateLink,
  downloadVideo,
};
