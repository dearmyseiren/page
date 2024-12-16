$(function () {
  const playerTrack = $("#player-track");
  const bgArtwork = $("#player-bg-artwork");
  const albumName = $("#album-name");
  const trackName = $("#track-name");
  const albumArt = $("#album-art");
  const sArea = $("#seek-bar-container");
  const seekBar = $("#seek-bar");
  const trackTime = $("#track-time");
  const seekTime = $("#seek-time");
  const sHover = $("#s-hover");
  const playPauseButton = $("#play-pause-button");
  const tProgress = $("#current-time");
  const tTime = $("#track-length");
  const playPreviousTrackButton = $("#play-previous");
  const playNextTrackButton = $("#play-next");
  const albums = ["dear my seiren"];
  const trackNames = [
    "ftisland - crazy love",
    "ftisland - sayonara",
    "ftisland - aqua (japanese)",
    "ftisland - アリガト",
    "jaejin - betelgeuse",
    "ftisland - hold the moon",
    "ftisland - imagine",
    "ftisland - a light in the forest",
    "ftisland - paper plane",
    "ftisland - so today...",
    "ftisland - stay what you are",
    "ftisland - time",
    "ft - you don't know who i am",
    "ftisland - yume",
    "ftisland - aqua",
  ];
  const albumArtworks = [
    "_2", "_3", "_4", "_5", "_5", "_5", "_5", "_5", "_5", "_5", "_5", "_5", "_5", "_5", "_5"
  ];
  const trackUrl = [
    "https://dearmyseiren.github.io/resource/crazylove.mp3",
    "https://dearmyseiren.github.io/resource/sayonara.mp3",
    "https://dearmyseiren.github.io/resource/aquajp.mp3",
    "https://dearmyseiren.github.io/resource/arigato.mp3",
    "https://dearmyseiren.github.io/resource/betelgeuse.mp3",
    "https://dearmyseiren.github.io/resource/holdthemoon.mp3",
    "https://dearmyseiren.github.io/resource/imagine.mp3",
    "https://dearmyseiren.github.io/resource/lightforest.mp3",
    "https://dearmyseiren.github.io/resource/paperplane.mp3",
    "https://dearmyseiren.github.io/resource/sotoday.mp3",
    "https://dearmyseiren.github.io/resource/staywhatyouare.mp3",
    "https://dearmyseiren.github.io/resource/time.mp3",
    "https://dearmyseiren.github.io/resource/youdontknow.mp3",
    "https://dearmyseiren.github.io/resource/yume.mp3",
    "https://dearmyseiren.github.io/resource/aqua.mp3",
  ];

  let bgArtworkUrl,
    i = playPauseButton.find("i"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    currIndex = -1;

  function playPause() {
    setTimeout(function () {
      if (audio.paused) {
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
        i.attr("class", "fas fa-pause");
        audio.play();
      } else {
        playerTrack.removeClass("active");
        albumArt.removeClass("active");
        clearInterval(buffInterval);
        albumArt.removeClass("buffering");
        i.attr("class", "fas fa-play");
        audio.pause();
      }
    }, 300);
  }

  function showHover(event) {
    seekBarPos = sArea.offset();
    seekT = event.clientX - seekBarPos.left;
    seekLoc = audio.duration * (seekT / sArea.outerWidth());

    sHover.width(seekT);

    cM = seekLoc / 60;

    ctMinutes = Math.floor(cM);
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60);

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes;
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds;

    seekTime.text(ctMinutes + ":" + ctSeconds);
    seekTime.css({ left: seekT, "margin-left": "-21px" }).fadeIn(0);
  }

  function hideHover() {
    sHover.width(0);
    seekTime.text("00:00").css({ left: "0px", "margin-left": "0px" }).fadeOut(0);
  }

  function playFromClickedPos() {
    audio.currentTime = seekLoc;
    seekBar.width(seekT);
    hideHover();
  }

  function updateCurrTime() {
    curMinutes = Math.floor(audio.currentTime / 60);
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60);

    durMinutes = Math.floor(audio.duration / 60);
    durSeconds = Math.floor(audio.duration - durMinutes * 60);

    playProgress = (audio.currentTime / audio.duration) * 100;

    if (curMinutes < 10) curMinutes = "0" + curMinutes;
    if (curSeconds < 10) curSeconds = "0" + curSeconds;

    if (durMinutes < 10) durMinutes = "0" + durMinutes;
    if (durSeconds < 10) durSeconds = "0" + durSeconds;

    tProgress.text(curMinutes + ":" + curSeconds);
    tTime.text(durMinutes + ":" + durSeconds);

    seekBar.width(playProgress + "%");

    if (playProgress === 100) {
      i.attr("class", "fa fa-play");
      seekBar.width(0);
      tProgress.text("00:00");
      albumArt.removeClass("buffering active");
      clearInterval(buffInterval);
    }
  }

  function checkBuffering() {
    clearInterval(buffInterval);
    buffInterval = setInterval(function () {
      if (nTime === 0 || bTime - nTime > 1000) albumArt.addClass("buffering");
      else albumArt.removeClass("buffering");

      bTime = new Date().getTime();
    }, 100);
  }

  function selectTrack(flag) {
    if (flag === 0 || flag === 1) ++currIndex;
    else --currIndex;

    if (currIndex > -1 && currIndex < trackUrl.length) {
      if (flag === 0) i.attr("class", "fa fa-play");
      else i.attr("class", "fa fa-pause");

      seekBar.width(0);
      tProgress.text("00:00");
      tTime.text("00:00");

      currAlbum = albums[0];
      currTrackName = trackNames[currIndex];
      currArtwork = albumArtworks[currIndex];

      audio.src = trackUrl[currIndex];

      if (flag !== 0) {
        audio.play();
        playerTrack.addClass("active");
        albumArt.addClass("active");
        checkBuffering();
      }

      albumName.text(currAlbum);
      trackName.text(currTrackName);
      albumArt.find("img.active").removeClass("active");
      $("#" + currArtwork).addClass("active");

      bgArtworkUrl = $("#" + currArtwork).attr("src");
      bgArtwork.css({ "background-image": "url(" + bgArtworkUrl + ")" });
    } else {
      if (flag === 0 || flag === 1) --currIndex;
      else ++currIndex;
    }
  }

  function initPlayer() {
    audio = new Audio();

    selectTrack(0);

    audio.loop = false;

    playPauseButton.on("click", playPause);

    sArea.mousemove(showHover).mouseout(hideHover).on("click", playFromClickedPos);

    $(audio).on("timeupdate", updateCurrTime);

    // 자동 재생 기능 추가
    $(audio).on("ended", function () {
      selectTrack(1); // 다음 곡 재생
    });

    playPreviousTrackButton.on("click", function () {
      selectTrack(-1);
    });
    playNextTrackButton.on("click", function () {
      selectTrack(1);
    });
  }

  initPlayer();
});
