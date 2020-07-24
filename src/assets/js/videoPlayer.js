const videoPlayer = document.getElementById("jsVideoPlayer");
const videoPlayerTop = document.getElementById("jsVideoPlayerTop");
const videoPlyerBottom = document.getElementById("jsVideoPlayerBottom");
const video = document.getElementById("jsVideo");
const playBtn = document.getElementById("jsPlayBtn");
const fullscreenBtn = document.getElementById("jsFullscreenBtn");
const currentTime = document.getElementById("jsCurrentTime");
const totalTime = document.getElementById("jsTotalTime");
const currentPgBar = document.getElementById("jsCurrentPgBar");
const volumeBtn = document.getElementById("jsVolumeBtn");

let timeOutContainer;

const registerView = () => {
  const videoId = window.location.href.split("/video/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

const handleEnded = () => {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
};

const handleMouseLeave = () => {
  clearTimeout(timeOutContainer);
  videoPlayerTop.style.opacity = 0;
  videoPlyerBottom.style.opacity = 0;
};

const handleMouseMove = () => {
  clearTimeout(timeOutContainer);
  videoPlayer.style.cursor = "default";
  videoPlayerTop.style.opacity = 1;
  videoPlyerBottom.style.opacity = 1;
  timeOutContainer = setTimeout(() => {
    videoPlayerTop.style.opacity = 0;
    videoPlyerBottom.style.opacity = 0;
  }, 3000);
};

const handleVolumeClick = () => {
  if (video.muted) {
    video.muted = false;
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else {
    video.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
};

const setCurrentTimeBar = () => {
  const total = video.duration;
  const current = video.currentTime;
  const currentPer = (current / total) * 100;
  currentPgBar.style.width = `${currentPer}%`;
};

const initCurrentTime = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  const hours = Math.floor(secondsNumber / 3600);

  if (hours >= 1) return "00:00:00";

  return "00:00";
};
const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours === "00" ? "" : `${hours}:`}${minutes}:${totalSeconds}`;
};

const setTotalTime = () => {
  const { duration } = video;
  totalTime.innerHTML = formatDate(duration);
  currentTime.innerHTML = initCurrentTime(duration);
};

const getCurrentTime = () => {
  currentTime.innerHTML = formatDate(Math.floor(video.currentTime));
  setCurrentTimeBar();
};

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozExitFullscreen) {
    document.mozExitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullscreenBtn.removeEventListener("click", exitFullscreen);
  fullscreenBtn.addEventListener("click", goFullscreen);
};

const goFullscreen = () => {
  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (videoPlayer.mozRequestFullscreen) {
    videoPlayer.mozrequestFullscreen();
  } else if (videoPlayer.webkitRequestFullscreen) {
    videoPlayer.webkitRequestFullscreen();
  } else if (videoPlayer.msRequestFullscreen) {
    videoPlayer.msRequestFullscreen();
  }
  fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullscreenBtn.removeEventListener("click", goFullscreen);
  fullscreenBtn.addEventListener("click", exitFullscreen);
};

const handlePlayClick = () => {
  if (video.paused) {
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    video.play();
  } else {
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    video.pause();
  }
};

const init = () => {
  playBtn.addEventListener("click", handlePlayClick);
  fullscreenBtn.addEventListener("click", goFullscreen);
  videoPlayer.addEventListener("mousemove", handleMouseMove);
  video.addEventListener("click", handlePlayClick);
  video.addEventListener("timeupdate", getCurrentTime);
  video.addEventListener("loadedmetadata", setTotalTime);
  video.addEventListener("ended", handleEnded);
  volumeBtn.addEventListener("click", handleVolumeClick);
  videoPlayer.addEventListener("mouseleave", handleMouseLeave);
};
if (videoPlayer) init();
