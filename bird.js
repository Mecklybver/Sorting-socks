import { average, vLerp, distance } from "./math.js";

class Bird {
  constructor(lFoot, rFoot, headY) {
    this.lFoot = lFoot;
    this.rFoot = rFoot;
    this.headY = headY;
    this.head= null;
    this.lKneee = null;
    this.rKneee = null;
    this.queue = [];
    this.#update();
    this.legLength = distance(this.lFoot, this.rFoot)*1.4;
    this.#update();

  }
  moveTo(lFoot, rFoot, frameCount = 40) {
    for (let i = 1; i <= frameCount; i++) {
      const t = i / frameCount;
      this.queue.push({
      lFoot: vLerp(this.lFoot, lFoot, t),
      rFoot: vLerp(this.rFoot, rFoot, t)
    })
    }
  }

  
  #update() {

    let changed = false;
    if (this.queue.length > 0) {
      const info = this.queue.shift();
      this.lFoot = info.lFoot;
      this.rFoot = info.rFoot;
      changed = true;
    }
    this.head = average(this.lFoot, this.rFoot);
    this.head.y = this.headY;

    

    return changed;
  }
  draw(ctx) {
    const changed=this.#update()
    ctx.fillStyle = "black";
    ctx.beginPath();
    const radius=10;
    ctx.arc(this.head.x, this.head.y,radius,0,2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.head.x,this.head.y);
    ctx.lineTo(this.lFoot.x,this.lFoot.y);
    ctx.stroke()
    ctx.beginPath();
    ctx.moveTo(this.head.x,this.head.y);
    ctx.lineTo(this.rFoot.x,this.rFoot.y);
    ctx.stroke()
    return changed;

  }
}

export default Bird;