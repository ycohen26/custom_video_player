/* Get Our Elements */
const player = document.querySelector(".player");
const video = player.querySelector(".viewer");
const progress = player.querySelector(".progress");
const progressBar = player.querySelector(".progress__filled");
const toggle = player.querySelector(".toggle");
const skipButtons = player.querySelectorAll("[data-skip]");
const ranges = player.querySelectorAll(".player__slider");
const canvas = document.querySelector(".video");
const ctx = canvas.getContext("2d");
const redEffectButton = document.querySelector(".redEffectButton");
const rgbSplitButton = document.querySelector(".rgbSplitButton");
// const greenScreenButton = document.querySelector(".greenScreenButton");

/* Build out functions */
function togglePlay() {
  const method = video.paused ? "play" : "pause";
  video[method]();
}

function updateButton() {
  const icon = this.paused ? "►" : "❚ ❚";
  console.log(icon);
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    if (redEffectOn) {
      pixels = redEffect(pixels);
    }
    ctx.putImageData(pixels, 0, 0);
    if (rgbSplitOn) {
      pixels = rgbSplit(pixels);
    }
    // if (greenScreenOn) {
    //   pixels = greenScreen(pixels);
    // }
    // console.log(pixels, "pixels");
  }, 30);
}
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  console.log(pixels, "redeffect");
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  console.log(pixels, "rgbSplit");
  return pixels;
}

// function greenScreen(pixels) {
//   const levels = {};

//   document.querySelectorAll(".rgb input").forEach((input) => {
//     levels[input.name] = input.value;
//   });

//   for (let i = 0; i < pixels.data.length; i = i + 4) {
//     red = pixels.data[i + 0];
//     green = pixels.data[i + 1];
//     blue = pixels.data[i + 2];
//     alpha = pixels.data[i + 3];

//     if (
//       red >= levels.rmin &&
//       green >= levels.gmin &&
//       blue >= levels.bmin &&
//       red <= levels.rmax &&
//       green <= levels.gmax &&
//       blue <= levels.bmax
//     ) {
//       // take it out!
//       pixels.data[i + 3] = 0;
//     }
//   }

//   return pixels;
// }

/* Hook up the event listeners */
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);
video.addEventListener("canplay", paintToCanvas);

toggle.addEventListener("click", togglePlay);
skipButtons.forEach((button) => button.addEventListener("click", skip));
ranges.forEach((range) => range.addEventListener("change", handleRangeUpdate));
ranges.forEach((range) => range.addEventListener("mousemove", handleRangeUpdate));
let redEffectOn = false;
redEffectButton.addEventListener("click", () => (redEffectOn = !redEffectOn));
let rgbSplitOn = false;
rgbSplitButton.addEventListener("click", () => (rgbSplitOn = !rgbSplitOn));
// let greenScreenOn = false;
// greenScreenButton.addEventListener("click", () => (greenScreenOn = !greenScreenOn));

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousemove", (e) => mousedown && scrub(e));
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));
