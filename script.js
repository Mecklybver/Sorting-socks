import Sock from "./socks.js";
import Physics from "./physics.js";
import { lerp } from "./math.js";


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

const colors =['#D35400', '#2471A3', '#F39C12',
'#B2BABB', '#138D75', '#52BE80',
'#BB8FCE', '#555555', '#bcf60c',
'#fabebe', '#9a6324', '#54A1D3',
'#aaffc3', '#808000', '#333333']

const sockColors = []

for (let i = 0; i < n/2; i++) {
  const t=i/(n/2-1)
  sockColors.push(colors[i])
  sockColors.push(colors[i])
  array.push(lerp(0.2,1,t))
  array.push(lerp(0.2,1,t))
}


for(let i=0;i<array.length;i++){
  const j=Math.floor(Math.random()*array.length);
  [array[i],array[j]]=[array[j],array[i]];
  [sockColors[i],sockColors[j]]=[sockColors[j],sockColors[i]];
}


for (let i = 0; i < array.length; i++) {
  const x = i * spacing + spacing / 2 + margin;
  const y = StringHeight;
  const height = canvas.height * 0.4 * array[i];
  socks[i] = new Sock(x, y, height, sockColors[i]);
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

    Physics.update(socks[i].particles, socks[i].segments )
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
