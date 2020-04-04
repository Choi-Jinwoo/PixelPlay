const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const fileInput = document.getElementById('fileInput');
const upload = document.getElementById('upload');

let pixelsInOne = 256;
let originalImage;
let count = 0;

upload.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const fileReader = new FileReader();

  fileReader.onload = (e) => {
    const image = new Image();
    image.src = e.target.result;
    image.onload = () => {
      originalImage = image;
      drawImageData(image);
    };
  };

  fileReader.readAsDataURL(file);
  count = 0;
});

canvas.addEventListener('mousemove', (e) => {
  count++;
  if (count % 60 !== 0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawImageData(originalImage);
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const filteredData = invertFilter(pixels);
  ctx.putImageData(filteredData, 0, 0);
  pixelsInOne = pixelsInOne / 2;
});

function drawImageData(image) {
  if (image.width > canvas.width) {
    const rate = canvas.width / image.width;
    console.log(rate);
    image.width *= rate;
    image.height *= rate;
  }

  ctx.drawImage(image, 0, 0, image.width, image.height);
}

function invertFilter(pixels) {
  if (pixelsInOne <= 1) return pixels;
  let d = pixels.data;

  const width = pixels.width;

  let targetPixel = 0;
  for (let i = 0; i < pixels.data.length; i += width * 4) {
    for (let j = i; j < i + 4 * width - 1; j += 4) {
      const x = Math.floor(j / 4) % width;
      const y = Math.floor(i / (width * 4));

      if (x % pixelsInOne === 0 && y % pixelsInOne) {
        targetPixel = j;
      }

      d[j] = d[targetPixel];
      d[j + 1] = d[targetPixel + 1];
      d[j + 2] = d[targetPixel + 2];
      d[j + 3] = d[targetPixel + 3];
    }
  }

  return pixels;
}
