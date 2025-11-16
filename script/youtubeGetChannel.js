import { APIKEY } from "./youtubeAPI.js";

const apiKey = APIKEY;
const video = document.getElementById("youtubeVideo");
const videoSrc = video.getAttribute("src");
const videoId = getYoutubeId(videoSrc);
const textChannel = document.getElementById("textChannel");
const textTitle = document.getElementById("textTitle");
const ppChannel = document.getElementById("ppChannel");

getYoutubeInfo(videoId, apiKey);

async function getYoutubeInfo(videoId, apiKey) {
  const videoRes = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
  const videoData = await videoRes.json();

  if (!videoData.items || videoData.items.length === 0) {
    console.error("Video tidak ditemukan.");
    return;
  }

  const channelId = videoData.items[0].snippet.channelId;

  const channelRes = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`);
  const channelData = await channelRes.json();

  if (!channelData.items || channelData.items.length === 0) {
    console.error("Channel tidak ditemukan.");
    return;
  }

  // update UI
  textChannel.innerText = channelData.items[0].snippet.title;
  ppChannel.setAttribute("src", channelData.items[0].snippet.thumbnails.high.url);
  textTitle.innerText = ` - ${videoData.items[0].snippet.title}`;
}

function getYoutubeId(url) {
  const reg = /(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(reg);
  return match ? match[1] : null;
}
