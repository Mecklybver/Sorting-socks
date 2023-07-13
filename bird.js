import { average, vLerp, distance, easeInOutBack } from "./math.js";

class Bird {
  constructor(lFoot, rFoot, height) {
    this.lFoot = lFoot;
    this.rFoot = rFoot;
    this.height = height;
    this.head = null;
    this.lKnee = null;
    this.rKnee = null;
    this.queue = [];
    this.blinking = false;
    this.#update();
    this.legLength = distance(this.lFoot, this.head) * 1.15;
    this.#update();
  }
  moveTo(lFoot, rFoot, doBounce = false, frameCount = 40) {
    for (let i = 1; i <= frameCount; i++) {
      const t = i / frameCount;
      const u = Math.sin(t * Math.PI);

      const w = doBounce ? t * 1.5 - 0.5 : t;
      const frame = {
        lFoot: vLerp(this.lFoot, lFoot, Math.max(0, w)),
        rFoot: vLerp(this.rFoot, rFoot, Math.max(0, w)),
      };

      if (doBounce) {
        frame.lFoot.y -= Math.max(0, w) * u * this.legLength * 0.3;
        frame.rFoot.y -= Math.max(0, w) * u * this.legLength * 0.3;
      }
      frame["head"] = this.head = average(frame.lFoot, frame.rFoot);
      frame["head"].y -= this.height;
      if (doBounce) {
        const v = easeInOutBack(t);
        frame["head"].y += v * this.legLength * 0.28;
      }

      this.queue.push(frame);
    }
  }

 #update(time) {
  let changed = false;
  const info = this.queue.shift();
  if (this.queue.length > 0) {
    this.lFoot = info.lFoot;
    this.rFoot = info.rFoot;
    this.head = info.head;
    changed = true;
  } else if (this.legLength && this.queue.length === 0) {  
    // Animation is completed, add head movement logic here
    const fidgetAmount = Math.sin(time) * 0.1; // Adjust the fidget amount as desired
    this.head.y += fidgetAmount;
  }
  
  if (this.legLength) {
    this.lKnee = this.#getKnee(this.head, this.lFoot);
    this.rKnee = this.#getKnee(this.head, this.rFoot, Math.PI);
  } else {
    this.head = average(this.lFoot, this.rFoot);
    this.head.y -= this.height;
    this.lKnee = average(this.lFoot, this.head);
    this.rKnee = average(this.rFoot, this.head);
  }

  return changed;
}

  #getKnee(head, foot, angleOffset = 0) {
    const center = average(foot, head);
    const angle = Math.atan2(foot.y - head.y, foot.x - head.x);
    const base = distance(foot, head);
    const heightAbsoluteAngle = angle + Math.PI / 2 + angleOffset;
    const height = Math.sqrt((this.legLength / 2.3) ** 2 - (base / 2.3) ** 2);

    return {
      x: center.x + Math.cos(heightAbsoluteAngle) * height,
      y: center.y + Math.sin(heightAbsoluteAngle) * height,
    };
  }

  #drawHead(ctx, time) {
    ctx.beginPath();
    const radius = 18;
    ctx.fillStyle = "darkblue";
    ctx.strokeStyle = "darkblue";
    ctx.arc(this.head.x, this.head.y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "white";
    const eyeSize = radius * 0.6;
    this.blinking = time % 8 <= 0.7 ? true : false;
    const eyebrowsMove = Math.cos(time) * 3

    if (this.blinking) {
      ctx.fillStyle = "black";
      ctx.strokeStyle = "black";
      ctx.ellipse(
        this.head.x - radius * 0.5,
        this.head.y ,
        eyeSize * 0.6,
        eyeSize * 0.1,
        -0.3,
        0,
        Math.PI * 2
      );
      ctx.ellipse(
        this.head.x + radius * 0.5,
        this.head.y,
        eyeSize * 0.6,
        eyeSize * 0.1,
        +0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    if (!this.blinking) {
      ctx.ellipse(
        this.head.x - radius * 0.5,
        this.head.y,
        eyeSize * 0.6,
        eyeSize * 0.8,
        -0.3,
        0,
        Math.PI * 2
      );
      ctx.ellipse(
        this.head.x + radius * 0.5,
        this.head.y,
        eyeSize * 0.6,
        eyeSize * 0.8,
        +0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.save()
      ctx.fillStyle = "black";
      ctx.ellipse(
        this.head.x - radius * 0.6,
        this.head.y -13 - eyebrowsMove,
        eyeSize * 0.9,
        eyeSize * 0.20,
        +0.2,
        0,
        Math.PI * 2
      );
      ctx.ellipse(
        this.head.x + radius * 0.6,
        this.head.y -13 -eyebrowsMove,
        eyeSize * 0.9,
        eyeSize * 0.20,
        -0.2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      


      ctx.restore();
      ctx.beginPath();
      ctx.fillStyle = "#ADD8E6";

      ctx.arc(
        this.head.x - radius * 0.4,
        this.head.y + 3,
        radius * 0.26,
        0,
        2 * Math.PI
      );
      ctx.arc(
        this.head.x + radius * 0.4,
        this.head.y + 3,
        radius * 0.26,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = "black";

      ctx.arc(
        this.head.x - radius * 0.4,
        this.head.y + 3,
        radius * 0.12,
        0,
        2 * Math.PI
      );
      ctx.arc(
        this.head.x + radius * 0.4,
        this.head.y + 3,
        radius * 0.12,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
   
    ctx.closePath();
    ctx.beginPath();
    ctx.save();
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "yellow";
    ctx.moveTo(this.head.x - radius * 0.3, this.head.y + radius * 0.5);
    ctx.lineTo(this.head.x, this.head.y + radius * 1.6);
    ctx.lineTo(this.head.x + radius * 0.3, this.head.y + radius * 0.5);
    ctx.lineTo(this.head.x, this.head.y - radius * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    if( time % 5 > 1){
    ctx.strokeStyle = "black";
    ctx.moveTo(this.head.x - radius * 0.3, this.head.y + radius * 0.5);
    ctx.lineTo(this.head.x, this.head.y + radius * 1.2);
    ctx.lineTo(this.head.x + radius * 0.3, this.head.y + radius * 0.5);
    ctx.lineTo(this.head.x, this.head.y - radius * 0.2);
    ctx.stroke();}
    else{
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1
    
    ctx.moveTo(this.head.x - radius * 0.3, this.head.y + radius * 0.5);
    ctx.lineTo(this.head.x, this.head.y + radius * 1.1);
    ctx.lineTo(this.head.x + radius * 0.3, this.head.y + radius * 0.5);
    ctx.lineTo(this.head.x, this.head.y - radius * 0.2);
    ctx.moveTo(this.head.x - radius * 0.3, this.head.y + radius * 0.5);
    ctx.lineTo(this.head.x, this.head.y + radius * 0.9);
    ctx.lineTo(this.head.x + radius * 0.3, this.head.y + radius * 0.5);
    ctx.lineTo(this.head.x, this.head.y - radius * 0.2);
    ctx.stroke();}
   
  }



  draw(ctx, time, tweenLength) {
    ctx.save();
    const changed = this.#update(time);
    const radius = 18;
    const randomAmplitude = Math.cos(time) * 0.4 * tweenLength * 0.03
    const featherMoves = Math.sin(time) * randomAmplitude * tweenLength * 0.02
    ctx.beginPath();
    ctx.fillStyle = "darkblue";
    ctx.ellipse(
      this.head.x - radius,
      this.head.y - radius *0.2,
      25,
      5,
      +0.3 + featherMoves + randomAmplitude,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x  + radius ,
      this.head.y -radius *0.2,
      25,
      5,
      -0.3 - featherMoves - randomAmplitude ,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x - radius * 0.9,
      this.head.y - radius *0.2,
      25,
      5,
      +0.8 + featherMoves,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x  + radius * 0.9,
      this.head.y -radius *0.2,
      25,
      5,
      -0.8 - featherMoves,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x - radius * 0.6,
      this.head.y - radius *0.4,
      25,
      5,
      +1 + featherMoves ,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x  + radius * 0.6,
      this.head.y -radius *0.4,
      25,
      5,
      -1 - featherMoves ,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x - radius * 0.4,
      this.head.y - radius *0.45,
      25,
      5,
      +1.4 + featherMoves ,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x  + radius * 0.4,
      this.head.y -radius *0.45,
      25,
      5,
      -1.4 - featherMoves ,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x - radius * 0.2,
      this.head.y - radius *0.4,
      25,
      5,
      +1.6 + featherMoves,
      0,
      Math.PI * 2
    );
    ctx.ellipse(
      this.head.x  + radius * 0.2,
      this.head.y -radius *0.4,
      25,
      5,
      -1.6 - featherMoves,
      0,
      Math.PI * 2
    );
    ctx.fill()

    const t = this.queue.length / tweenLength;
    const u = Math.sin(t * Math.PI);
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "orange";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.lineWidth = 4
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.head.x, this.head.y);
    ctx.lineTo(this.lKnee.x, this.lKnee.y);
    ctx.lineTo(this.lFoot.x, this.lFoot.y);
    ctx.stroke();
    ctx.lineWidth = 3
    ctx.strokeStyle = "orange";
    ctx.stroke();
    const ankle = vLerp(this.lKnee, this.lFoot, 0.7);
    const angle = Math.atan2(
      this.lFoot.y-this.lKnee.y,
      this.lFoot.x-this.lKnee.x
    )
    const dist = distance(ankle,this.lFoot)
    const toe1 ={
      x:ankle.x + dist* Math.cos(angle+0.7),
      y:ankle.y + dist* Math.sin(angle+0.7)
    }
    const toe2 ={
      x:ankle.x + dist * Math.cos(angle-0.7),
      y:ankle.y + dist * Math.sin(angle-0.7)
    }
    ctx.moveTo(toe1.x, toe1.y);
    ctx.lineTo(ankle.x, ankle.y);
    ctx.moveTo(toe2.x, toe2.y);
    ctx.lineTo(ankle.x, ankle.y);
    ctx.stroke()
    const ankle2 = vLerp(this.rKnee, this.rFoot, 0.7);
    const angle2 = Math.atan2(
      this.rFoot.y-this.rKnee.y,
      this.rFoot.x-this.rKnee.x
    )
    const dist2 = distance(ankle2,this.rFoot)
    const toe1r ={
      x:ankle2.x + dist2*Math.cos(angle2+0.7),
      y:ankle2.y + dist2*Math.sin(angle2+0.7)
    }
    const toe2r ={
      x:ankle2.x + dist*Math.cos(angle2-0.7),
      y:ankle2.y + dist*Math.sin(angle2-0.7)
    }
    ctx.moveTo(toe1r.x, toe1r.y);
    ctx.lineTo(ankle2.x, ankle2.y);
    ctx.moveTo(toe2r.x, toe2r.y);
    ctx.lineTo(ankle2.x, ankle2.y);
    ctx.stroke()




    ctx.save()
    ctx.setLineDash([1, 6]);
    ctx.strokeStyle = "darkred";
    ctx.moveTo(toe1.x, toe1.y);
    ctx.lineTo(ankle.x, ankle.y);
    ctx.moveTo(toe2.x, toe2.y);
    ctx.lineTo(ankle.x, ankle.y);
    ctx.stroke();
    ctx.restore();

    ctx.lineWidth = 4
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.head.x, this.head.y);
    ctx.lineTo(this.rKnee.x, this.rKnee.y);
    ctx.lineTo(this.rFoot.x, this.rFoot.y);
    ctx.stroke();
    ctx.moveTo(this.head.x, this.head.y);
    ctx.lineTo(this.lKnee.x, this.lKnee.y);
    ctx.lineTo(this.lFoot.x, this.lFoot.y);
    ctx.stroke();
    ctx.lineWidth = 3
    ctx.strokeStyle = "orange";
    ctx.stroke();
   



    ctx.setLineDash([1, 6]);
    ctx.strokeStyle = "darkred";
    ctx.beginPath();
    ctx.moveTo(this.head.x, this.head.y);
    ctx.lineTo(this.lKnee.x, this.lKnee.y);
    ctx.lineTo(this.lFoot.x, this.lFoot.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(this.head.x, this.head.y);
    ctx.lineTo(this.rKnee.x, this.rKnee.y);
    ctx.lineTo(this.rFoot.x, this.rFoot.y);
    ctx.stroke();

    ctx.restore();
    


    this.#drawHead(ctx, time, u);
    ctx.restore();

    return changed;
  }
}

export default Bird;
