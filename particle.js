import {add,subtract} from "./math.js";
import Physics from "./physics.js";

class Particle {
    constructor(loc, fixed=false){
        this.loc = loc;
        this.fixed = fixed;
        this.oldLoc = loc;
    }
    #update(){
        if(this.fixed){
            return;
        }
        const vel=subtract(this.loc,this.oldLoc);
        const newLoc = add(this.loc,vel);
        const withGravity = add(newLoc,
            {x:0, y:Physics.G});
        this.oldLoc = this.loc;
        this.loc = withGravity;

    }
    draw(ctx,radius=3){
        this.#update();
        ctx.beginPath();
        ctx.fillStyle="green";
        ctx.arc(this.loc.x,this.loc.y,radius,0,Math.PI*2);
        ctx.fill();

    }
}

export default Particle;