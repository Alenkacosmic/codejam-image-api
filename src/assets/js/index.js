/* eslint-disable no-bitwise */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable block-scoped-var */
/* eslint-disable no-undef */

/* disabled the no-undef rule cause use ids from html file as element identifiers */
/* disabled var rules cause using them alows me to use variables outside functions */
/* disabled bitwise rule cause i need to use them for color calculation */

const canvas = document.getElementById('switcher');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d');
const dataURL = localStorage.getItem('switcherThe');

if (dataURL !== null) {
  const img = new Image();
  img.src = dataURL;
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
}

let scale = 4;
const pixelWidth = 512 / scale;
const pixelHeight = 512 / scale;
const drawPos = [];
let pixelColor = currentColor.value;
let previousColor = '#FFEB3B';

function changeCurrent(event) {
  const prevCurrentColor = pixelColor;
  previousColor = prevCurrentColor;
  prevColor.style.backgroundColor = previousColor;
  pixelColor = event.target.value;
}

function switchSizes(event) {
  let scaleDimension;

  if (event.target.classList.contains('draw128x128')) {
    scaleDimension = 4;
  } else if (event.target.classList.contains('draw256x256')) {
    scaleDimension = 2;
  } else if (event.target.classList.contains('draw512x512')) {
    scaleDimension = 1;
  }

  scale = scaleDimension;
}

function rgbStringToHex(rgb) {
  const arr = rgb.split(/\D+/);
  let hex = '';
  arr.forEach((element) => {
    if (element !== '') {
      if (+element < 10) {
        hex += `0${element}`;
      } else {
        hex += Number(element).toString(16);
      }
    }
  });
  return `#${hex}`;
}

function changeColorOut(event) {
  let defaultColor;

  if (event.target.classList.contains('red')) {
    defaultColor = getComputedStyle(event.target.children[0]).backgroundColor;
  } else if (event.target.classList.contains('blue')) {
    defaultColor = getComputedStyle(event.target.children[0]).backgroundColor;
  } else if (event.target.classList.contains('prev')) {
    defaultColor = getComputedStyle(event.target.children[0]).backgroundColor;
  }

  defaultColor = rgbStringToHex(defaultColor);
  currentColor.value = defaultColor;
  pixelColor = defaultColor;
}

function mouseForPicker(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  return [x, y];
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function getColor(position) {
  if (choose.classList.contains('chosenInstrument')) {
    const x = position[0];
    const y = position[1];
    const color = ctx.getImageData(
      Math.floor(x / (512 / canvas.height)),
      Math.floor(y / (512 / canvas.width)), 1, 1,
    ).data;
    const newColor = rgbToHex(color[0], color[1], color[2]);
    if (newColor !== pixelColor) {
      currentColor.value = newColor;
      pixelColor = newColor;
    }
  }
}

function chooseColor(event) {
  getColor(mouseForPicker(event));
}

canvas.addEventListener('mousedown', chooseColor);

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (Math.round((event.clientX - rect.left - (pixelWidth / 2)) / pixelWidth) * pixelWidth),
    y: (Math.round((event.clientY - rect.top - (pixelHeight / 2)) / pixelHeight) * pixelHeight),
  };
}

function drawImage() {
  let p = 0;
  while (p < drawPos.length) {
    ctx.fillStyle = drawPos[p].color || pixelColor;
    ctx.fillRect(drawPos[p].x, drawPos[p].y, pixelWidth, pixelHeight);
    p += 1;
  }
}

function startDrawing(event) {
  if (event.button === 0 && pencil.classList.contains('chosenInstrument')) {
    var mark = setInterval(() => {
      const pos = mouse;
      if (pos.color !== currentColor.value) {
        pos.color = currentColor.value;
        drawPos.push(pos);
      }
    }, 10);
  }
  function stopDrawing() {
    clearInterval(mark);
  }
  canvas.addEventListener('mouseup', stopDrawing);
}

function fillBucket() {
  if (bucket.classList.contains('chosenInstrument')) {
    ctx.fillStyle = currentColor.value;
    drawPos.fill(ctx.fillStyle);
    ctx.fillRect(0, 0, pixelWidth * scale, pixelHeight * scale);
  }
}

function chooseInstrument(event) {
  if (event.target.tagName === 'LI' && !event.target.classList.contains('inactive')) {
    const instrument = document.querySelectorAll('.type');
    instrument.forEach((item) => {
      if (item.classList.contains('chosenInstrument')) {
        item.classList.remove('chosenInstrument');
      }
    });

    event.target.classList.add('chosenInstrument');
    canvas.addEventListener('mousedown', startDrawing);
  } else if (event.type === 'keyup') {
    const instrument = document.querySelectorAll('.type');
    instrument.forEach((item) => {
      if (item.classList.contains('chosenInstrument')) {
        item.classList.remove('chosenInstrument');
      }
    });
    if (event.code === 'KeyP') {
      const button = document.querySelector('.pencil');
      button.classList.add('chosenInstrument');
      canvas.addEventListener('mousedown', startDrawing);
    } else if (event.code === 'KeyB') {
      const button = document.querySelector('.bucket');
      button.classList.add('chosenInstrument');
    } else if (event.code === 'KeyC') {
      const button = document.querySelector('.choose');
      button.classList.add('chosenInstrument');
    }
  }
}

function recordMouseMovement(event) {
  mouse = getMousePos(event);
}

async function getLinkToImage(request) {
  ctx.clearRect(0, 0, 512, 512);
  const key = 'client_id=cb50787c5e2712851350a8f1f824d21ed7100f80f77d131526672272bfa3456d';
  const url = `https://api.unsplash.com/photos/random?query=${request}&${key}`;
  const response = await fetch(url);
  const data = await response.json();
  const image = new Image();
  image.crossOrigin = 'alenka';
  image.imageSmoothingEnabled = false;
  image.src = data.urls.small;
  const ratio = data.width / data.height;
  const [width] = [canvas.width];
  const height = width / ratio;
  const medWidth = (canvas.width - width) / 2;
  const medHeight = (canvas.height - height) / 2;
  image.onload = () => {
    ctx.drawImage(image, medWidth, medHeight, width, height);
  };
}

const canvasSearchButton = document.getElementById('canvasSearch');

canvasSearchButton.addEventListener('click', () => {
  const canvasText = document.getElementById('canvasText');
  getLinkToImage(canvasText.value);
});

function getGrayImage() {
  const innerImage = ctx.getImageData(0, 0, 512, 512);
  const { data } = innerImage;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
  ctx.putImageData(innerImage, 0, 0);
}

canvas.addEventListener('click', () => {
  localStorage.setItem('switcherThe', canvas.toDataURL());
});

canvas.addEventListener('mousemove', recordMouseMovement);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawImage);
canvas.addEventListener('mousedown', fillBucket);
document.addEventListener('keyup', chooseInstrument);

instruments.addEventListener('click', chooseInstrument);

colours.addEventListener('mouseup', changeColorOut);

currentColor.addEventListener('input', changeCurrent);

grayScaleMe.addEventListener('click', getGrayImage);

buttonsToClick.addEventListener('click', switchSizes);
