import './style.css'

document.querySelector('#app').innerHTML = `
<div id="output"></div>
<video id="input" autoplay muted loop playsinline crossorigin="anonymous">
</video>
<canvas id="prerender" width="158" height="43"></canvas>
`

const videos = {
  Synthwave: "/public/pretty cvnt.mp4",
};

(() => {
  const video = document.getElementById("input");
  const canvas = document.getElementById("prerender");
  const output = document.getElementById("output");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const charsFixed = [
    ['.', '-'],
    [':', '_'],
    ["'", ':'],
    [',', '^'],
    ['=', ';'],
    ['>', '<'],
    ['+', '!'],
    ['r', 'c'],
    ['*', '/'],
    ['z', '?'],
    ['s', 'L'],
    ['T', 'v'],
    [')', 'J'],
    ['7', '|'],
    ['(', '|'],
    ['F', 'i'],
    ['{', 'C'],
    ['}', 'f'],
    ['I', '3'],
    ['1', 't'],
    ['l', 'u'],
    ['[', 'n'],
    ['e', 'o'],
    ['Z', '5'],
    ['Y', 'x'],
    ['j', 'y'],
    ['a', ']'],
    ['2', 'E'],
    ['S', 'w'],
    ['q', 'k'],
    ['P', '6'],
    ['h', '9'],
    ['d', '4'],
    ['V', 'p'],
    ['O', 'G'],
    ['b', 'U'],
    ['A', 'K'],
    ['X', 'H'],
    ['m', '8'],
    ['R', 'D'],
    ['#', '$'],
    ['B', 'g'],
    ['0', 'M'],
    ['N', 'W'],
    ['Q', '%'],
    ['&', '@']
  ];
  let chars = [...charsFixed];
  let charsLength = chars.length;
  const MAX_COLOR_INDEX = 255;

  const updateCanvas = () => {
    const w = canvas.width;
    const h = canvas.height;
    ctx.drawImage(video, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    let outputText = "";
    for (let y = 0; y < h; y++) {
      let row = "";
      for (let x = 0; x < w; x++) {
        const index = (x + y * w) * 4;
        const [r, g, b] = data.slice(index, index + 3);
        const c = (r + g + b) / 3;
        const charIndex = Math.floor(
          (charsLength * ((c * 100) / MAX_COLOR_INDEX)) / 100
        );
        const result = chars[charIndex];
        const char = Array.isArray(result)
          ? result[Math.floor(Math.random() * result.length) + 0]
          : result;

        row += `<span style="color: rgb(${r}, ${g}, ${b});">${char ?? "&nbsp;"
          }</span>`;
      }
      outputText += `<div>${row}</div>`;
    }
    output.innerHTML = outputText;

    setTimeout(() => requestAnimationFrame(updateCanvas), 0);
  };

  requestAnimationFrame(() => {
    video.play();
    updateCanvas();
  });

  const config = {
    speed: 1,
    zoom: 18,
    video: videos.Synthwave,
    isolation: 0,
    brightness: 1.5,
    play: true
  };

  const updateSpeed = (value) => {
    video.playbackRate = value;
  };

  const updateBrightness = (value) => {
    output.style.filter = `brightness(${value})`;
  };

  const updateZoom = (value) => {
    document.documentElement.style.fontSize = `${value}px`;
  };

  const updateIsolation = (value) => {
    chars = [...new Array(value).fill("&nbsp;"), ...charsFixed];
    charsLength = chars.length;
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

  updateSpeed(config.speed);
  updateBrightness(config.brightness);
  updateZoom(config.zoom);
  updateIsolation(config.isolation);
  updateVideo(config.video);
  updatePlay(config.play);
})();
