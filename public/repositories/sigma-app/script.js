var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

if (!window.idQueue) {
  window.idQueue = [];
}
var player;
let started = false;
function loadVideoById(id) {
  if (!player) {
    player = new YT.Player("player", {
      height: "360",
      width: "640",
      videoId: id,
      events: {
        onReady: onPlayerReady,
      },
    });
  } else {
    player.loadVideoById(id);
  }
}

function getQueue() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.idQueue.length == 0) return;
      const id = idQueue[0];
      window.idQueue.splice(0, 1);
      clearInterval(interval);
      resolve(id);
    }, 200);
  });
}
function onYouTubeIframeAPIReady() {
  started = true;
  nextVideo();
}

function onPlayerReady(event) {
  setInterval(() => {
    if (!player) return;
    if (
      player.getCurrentTime() > player.getDuration() - 21 &&
      player.getDuration() > 0
    ) {
      nextVideo();
    } else {
      started = true;
    }
  }, 500);
  event.target.playVideo();
}
function nextVideo() {
  if (!started) return;
  getQueue().then((id) => {
    loadVideoById(id);
  });
}
