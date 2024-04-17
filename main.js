import './style.css'
import video_url from "/pretty_cvnt.mp4"

document.querySelector('#app').innerHTML = `
  <div id="output"></div>
  <video id="input" autoplay muted loop playsinline crossorigin="anonymous"></video>
  <canvas id="prerender" width="144" height="39"></canvas>
`;

const video = document.getElementById("input");
const output = document.getElementById("output");

const canvas = document.getElementById("prerender");
const ctx = canvas.getContext("2d", { willReadFrequently: true, alpha: false });

const MAX_COLOR_INDEX = 255;
const chars = [
  ['.', '-'], [':', '_'], ["'", ':'],
  [',', '^'], ['=', ';'], ['>', '<'],
  ['+', '!'], ['r', 'c'], ['*', '/'],
  ['z', '?'], ['s', 'L'], ['T', 'v'],
  [')', 'J'], ['7', '|'], ['(', '|'],
  ['F', 'i'], ['{', 'C'], ['}', 'f'],
  ['I', '3'], ['1', 't'], ['l', 'u'],
  ['[', 'n'], ['e', 'o'], ['Z', '5'],
  ['Y', 'x'], ['j', 'y'], ['a', ']'],
  ['2', 'E'], ['S', 'w'], ['q', 'k'],
  ['P', '6'], ['h', '9'], ['d', '4'],
  ['V', 'p'], ['O', 'G'], ['b', 'U'],
  ['A', 'K'], ['X', 'H'], ['m', '8'],
  ['R', 'D'], ['#', '$'], ['B', 'g'],
  ['0', 'M'], ['N', 'W'], ['Q', '%'],
  ['&', '@']
];
let charsLength = chars.length;
const w = canvas.width;
const h = canvas.height;

const updateCanvas = () => {
  ctx.drawImage(video, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  let outputTextArr = Array(h);
  for (let y = 0; y < h; y++) {
    let rowArr = Array(w);
    for (let x = 0; x < w; x++) {
      const index = (x + y * w) * 4;
      const [r, g, b] = data.slice(index, index + 3);
      const c = (r + g + b) / 3;
      const charIndex = Math.floor(charsLength * (c / MAX_COLOR_INDEX));
      const result = chars[charIndex];
      const char = Array.isArray(result)
        ? result[Math.floor(Math.random() * result.length)]
        : result;

      rowArr[x] = `<span style="color: rgb(${r}, ${g}, ${b});">${char ?? "&nbsp;"}</span>`;
    }
    outputTextArr[y] = `<div>${rowArr.join('')}</div>`;
  }
  output.innerHTML = outputTextArr.join('');
  requestAnimationFrame(updateCanvas);
};

requestAnimationFrame(() => {
  video.play();
  updateCanvas();
});

const config = {
  zoom: 20,
  video: video_url,
  brightness: 1.2,
  play: true
};


const updateBrightness = (value) => {
  output.style.filter = `brightness(${value})`;
};

const updateZoom = (value) => {
  document.documentElement.style.fontSize = `${value}px`;
};

const updateVideo = (value) => {
  video.src = value;
  video.onloadeddata = () => {
    video.play();
  };
};

const updatePlay = (value) => {
  value ? video.play() : video.pause();
};

updateBrightness(config.brightness);
updateZoom(config.zoom);
updateVideo(config.video);
updatePlay(config.play);
