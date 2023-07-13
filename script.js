import Bird from "./bird.js";
import Sock from "./socks.js";
import Physics from "./physics.js";
import { lerp } from "./math.js";

const canvas = document.createElement("canvas");

document.body.appendChild(canvas);
canvas.width = window.innerWidth * 0.55;
canvas.height = window.innerHeight / 2;

const n = 20;
const array = [];
const stringHeight = canvas.height * 0.4;
const socks = [];
const margin = 30;
const availableWidth = canvas.width - margin * 2;
const spacing = availableWidth / n;

const colors = [
  "#D35400",
  "#2471A3",
  "#F39C12",
  "#B2BABB",
  "#138D75",
  "#52BE80",
  "#BB8FCE",
  "#555555",
  "#bcf60c",
  "#fabebe",
  "#9a6324",
  "#54A1D3",
  "#aaffc3",
  "#808000",
  "#333333",
];

const sockColors = [];

const tweenLength = 35;

for (let i = 0; i < n / 2; i++) {
  const t = i / (n / 2 - 1);
  sockColors.push(colors[i]);
  sockColors.push(colors[i]);
  array.push(lerp(0.2, 1, t));
  array.push(lerp(0.2, 1, t));
}

for (let i = 0; i < array.length; i++) {
  const j = Math.floor(Math.random() * array.length);
  [array[i], array[j]] = [array[j], array[i]];
  [sockColors[i], sockColors[j]] = [sockColors[j], sockColors[i]];
}

for (let i = 0; i < array.length; i++) {
  const u = Math.sin((i / (array.length - 1)) * Math.PI);
  const x = i * spacing + spacing / 2 + margin;
  const y = stringHeight + u * margin * 0.7;
  const height = canvas.height * 0.4 * array[i];
  socks[i] = new Sock(x, y, height, sockColors[i]);
}

const bird = new Bird(socks[0].loc, socks[1].loc, canvas.height * 0.26);

const moves = bubbleSort(array);
moves.shift();

const ctx = canvas.getContext("2d");
let time = 0;

function animate() {
  time += 0.03;
  time %= 6;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, stringHeight - margin*0.3);
  ctx.bezierCurveTo(
    canvas.width *0.3,stringHeight + margin,
    canvas.width * 0.7 ,stringHeight + margin *0.9,
    canvas.width,stringHeight - margin * 0.3
  );
  ctx.stroke();

  let changed = false;
  for (let i = 0; i < socks.length; i++) {
    changed = socks[i].draw(ctx) || changed;

    Physics.update(socks[i].particles, socks[i].segments);
  }

  changed = bird.draw(ctx, time, tweenLength) || changed;

  if (!changed && moves.length > 0) {
    const nextMove = moves.shift();
    const [i, j] = nextMove.indeces;
    if (nextMove.type === "swap") {
      socks[i].moveTo(socks[j].loc, tweenLength);
      socks[j].moveTo(socks[i].loc, tweenLength);
      bird.moveTo(socks[j].loc, socks[i].loc, false, tweenLength);

      [socks[i], socks[j]] = [socks[j], socks[i]];
    } else if (nextMove.type === "comparison") {
      bird.moveTo(socks[i].loc, socks[j].loc, true, tweenLength);
    }
  }

  requestAnimationFrame(animate);
}

animate();

function bubbleSort(array) {
  const moves = [];
  let n = array.length;
  let left = 1;
  do {
    var swapped = false;
    if ((n - left) % 2 === 1) {
      for (let i = left; i < n; i++) {
        moves.push({
          indeces: [i - 1, i],
          type: "comparison",
        });
        if (array[i - 1] > array[i]) {
          swapped = true;
          [array[i - 1], array[i]] = [array[i], array[i - 1]];
          moves.push({
            indeces: [i - 1, i],
            type: "swap",
          });
        }
      }
      n--;
    } else {
      for (let i = n - 1; i >= left; i--) {
        moves.push({
          indeces: [i - 1, i],
          type: "comparison",
        });
        if (array[i - 1] > array[i]) {
          swapped = true;
          [array[i - 1], array[i]] = [array[i], array[i - 1]];
          moves.push({
            indeces: [i - 1, i],
            type: "swap",
          });
        }
      }
      left++;
    }
  } while (swapped);
  return moves;
}
