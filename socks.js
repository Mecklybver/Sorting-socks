import { vLerp } from "./math.js";
import Particle from "./particle.js";
import Segment from "./segment.js";
class Sock {
  constructor(x, y, height) {
    this.width = 10;
    this.loc = { x, y };
  
    this.height = height;
    this.queue = [];
    this.particles = [];
    this.segments = [];
    this.#createParticles();
  }

  #createParticles(){
    const left = this.loc.x - this.width / 2;
    const right = this.loc.x + this.width / 2;
    const bottom = this.loc.y + this.height;
    this.particles.push(new Particle(this.loc, true));
    this.particles.push(new Particle({ x: left, y: bottom }));
    this.particles.push(new Particle({ x: right, y: bottom }));
    this.segments.push(new Segment(this.particles[0], this.particles[1]));
    this.segments.push(new Segment(this.particles[0], this.particles[2]));
    this.segments.push(new Segment(this.particles[1], this.particles[2]));
  }


  moveTo(newLoc, frameCount = 60) {
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
    // ctx.beginPath();
    // ctx.strokeStyle = "black";
    // ctx.rect(left, y, this.width, this.height);
    // ctx.stroke();

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].draw(ctx);
    }
    for (let i = 0; i < this.segments.length; i++) {
      this.segments[i].draw(ctx);
    }
    return changed;
  }
}

export default Sock;
