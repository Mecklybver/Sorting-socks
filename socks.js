import { vLerp } from "./math.js";
import Particle from "./particle.js";
import Segment from "./segment.js";
class Sock {
  constructor(x, y, height, color) {
    this.width = 8;
    this.loc = { x, y };
    this.color = color;
    this.height = height;
    this.queue = [];
    this.particles = [];
    this.segments = [];
    this.debug = false;
    this.blockHeight = 10;
    this.#createParticles();
    window.addEventListener("keydown", (e) => {
      if (e.key === "d") {
        this.debug = !this.debug;
      }
    });
  }

  #createParticles() {
    const left = this.loc.x - this.width / 2;
    const right = this.loc.x + this.width / 2;
    const bottom = this.loc.y + this.height;
    this.particles.push(new Particle(this.loc, true));
    let curHeight = this.loc.y;

    do {
      curHeight += this.blockHeight;
      this.particles.push(new Particle({ x: left, y: curHeight }));
      this.particles.push(new Particle({ x: right, y: curHeight }));
    } while (curHeight < this.height + this.loc.y);

    const lastP = this.particles[this.particles.length - 1];
    lastP.loc.x -= this.blockHeight * 2;
    lastP.loc.y += this.blockHeight * 0.1;
    const secondlastP = this.particles[this.particles.length - 2];
    secondlastP.loc.x -= this.blockHeight * 2;
    secondlastP.loc.y -= this.blockHeight * 0.2;
    const secondSecondlastP = this.particles[this.particles.length - 3];
    // secondSecondlastP.loc.x -= this.blockHeight * 3
    secondSecondlastP.loc.y += this.blockHeight;

    this.segments.push(new Segment(this.particles[0], this.particles[1]));
    this.segments.push(new Segment(this.particles[0], this.particles[2]));
    this.segments.push(new Segment(this.particles[1], this.particles[2]));

    for (let i = 3; i < this.particles.length; i += 2) {
      this.segments.push(new Segment(this.particles[i], this.particles[i - 2]));
      this.segments.push(
        new Segment(this.particles[i + 1], this.particles[i - 1])
      );
      this.segments.push(new Segment(this.particles[i], this.particles[i + 1]));
    }
    if (this.particles.length > 3) {
      this.segments.push(
        new Segment(lastP, this.particles[this.particles.length - 4])
      );
    }
  }

  moveTo(newLoc, frameCount = 40) {
    for (let i = 1; i <= frameCount; i++) {
      const t = i / frameCount;
      this.queue.push(vLerp(this.loc, newLoc, t));
    }
  }

  draw(ctx) {
    let changed = false;
    if (this.queue.length > 0) {
      this.loc = this.queue.shift();
      this.particles[0].loc = this.loc;
      changed = true;
    }
    const { x, y } = this.loc;
    const left = x - this.width / 2;
    const right = x + this.width / 2;
    const bottom = y + this.height;

    //drawing the socks
    const ps = this.particles;
    ctx.beginPath();
    ctx.moveTo(ps[0].loc.x, ps[0].loc.y);
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 2; i < ps.length; i += 2) {
      ctx.lineTo(ps[i].loc.x, ps[i].loc.y);
    }
    for (let i = ps.length - 2; i >= 0; i -= 2) {
      ctx.lineTo(ps[i].loc.x, ps[i].loc.y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle =`rgba(0,0,0,0.5)`
    ctx.setLineDash([3,3])
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth=4;
    ctx.strokeStyle = "black";
    ctx.moveTo(ps[0].loc.x, ps[0].loc.y -this.width/2);
    ctx.lineTo(ps[0].loc.x, ps[0].loc.y +this.width/2 );
    ctx.stroke();




    ctx.restore();

    if (this.debug) {
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.rect(left, y, this.width, this.height);
      ctx.stroke();

      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].draw(ctx);
      }
      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].draw(ctx);
      }
    }
    return changed;
  }
}

export default Sock;
