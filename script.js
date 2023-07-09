import Sock from "./socks.js";

const canvas = document.createElement("canvas");

document.body.appendChild(canvas);
canvas.width = window.innerWidth * 0.55;
canvas.height = window.innerHeight / 2;

const n = 20;
const array = [];
const StringHeight = canvas.height * 0.3;
const socks = [];
const margin = 30;
const availableWidth = canvas.width - margin * 2;
const spacing = availableWidth / n;

for (let i = 0; i < n; i++) {
  array[i] = Math.random();
}

for (let i = 0; i < array.length; i++) {
  const x = i * spacing + spacing / 2 + margin;
  const y = StringHeight;
  const height = canvas.height * 0.4 * array[i];
  socks[i] = new Sock(x, y, height);
}

const moves= bubbleSort(array);

const ctx = canvas.getContext("2d");

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, StringHeight);
  ctx.lineTo(canvas.width, StringHeight);
  ctx.stroke();

  let changed= false
  for (let i = 0; i < socks.length; i++) {
    changed=socks[i].draw(ctx)||changed;
  }

  if(!changed && moves.length>0){
    const nextMove = moves.shift();
    if(nextMove.type==="swap"){
        const [i,j] = nextMove.indeces;
        socks[i].moveTo(socks[j].loc)
        socks[j].moveTo(socks[i].loc);
        [socks[i],socks[j]]=[socks[j],socks[i]]
    }

  }

  requestAnimationFrame(animate);

}

animate();


function bubbleSort(array){
    const moves = [];
    do{
        var swapped = false;
        for(let i=1; i<array.length; i++){
            moves.push({
                indeces:[i-1,i],
                type:"comparison"
            });
            if(array[i-1]>array[i]){
                swapped = true;
                [array[i-1],array[i]]=[array[i],array[i-1]];
                moves.push({
                    indeces:[i-1,i],
                    type:"swap"
                });
            }
        }
    }while(swapped);
    return moves;
  }
