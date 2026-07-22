import { useRef, useEffect } from "react";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    // spider body
    const spider = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      targetX: canvas.width / 2,
      targetY: canvas.height / 2,
      bodyRadius: 12,
      headRadius: 8,
      speed: 0,
      angle: 0,
      velX: 0,
      velY: 0,
    };

    // leg configuration
    const NUM_LEGS = 8;
    const LEG_LENGTH_1 = 30; // upper segment
    const LEG_LENGTH_2 = 35; // lower segment
    const STEP_DISTANCE = 40;
    const STEP_SPEED = 0.3;

    // leg attachment angle (relative to the body)
    const legAngles = [
      -0.4, -0.8, -1.2, -1.6, // left legs
      0.4, 0.8, 1.2, 1.6,     // right legs
    ];

    // one leg-tip tracker per leg (where the foot currently is / is moving to)
    const legs = legAngles.map((angle) => {
      const legX = spider.x + Math.cos(angle) * (LEG_LENGTH_1 + LEG_LENGTH_2);
      const legY = spider.y + Math.sin(angle) * (LEG_LENGTH_1 + LEG_LENGTH_2);
      return {
        angle,
        x: legX,
        y: legY,
        targetX: legX,
        targetY: legY,
        moving: false,
      };
    });

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    canvas.addEventListener("mousemove", handleMouseMove);

    function drawLeg(hipX, hipY, footX, footY) {
      // simple 2-segment IK: find the knee position
      const dx = footX - hipX;
      const dy = footY - hipY;
      const dist = Math.min(Math.hypot(dx, dy), LEG_LENGTH_1 + LEG_LENGTH_2 - 1);
      const a = LEG_LENGTH_1;
      const b = LEG_LENGTH_2;

      // law of cosines to find knee angle offset
      const angleToFoot = Math.atan2(dy, dx);
      const cosKnee = (a * a + dist * dist - b * b) / (2 * a * dist);
      const kneeOffset = Math.acos(Math.min(1, Math.max(-1, cosKnee)));

      const kneeX = hipX + Math.cos(angleToFoot - kneeOffset) * a;
      const kneeY = hipY + Math.sin(angleToFoot - kneeOffset) * a;

      ctx.strokeStyle = "#2b1d14";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(kneeX, kneeY);
      ctx.lineTo(footX, footY);
      ctx.stroke();
    }

    let animationId;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // move spider body toward the mouse
      spider.targetX = mouseX;
      spider.targetY = mouseY;
      spider.velX += (spider.targetX - spider.x) * 0.01;
      spider.velY += (spider.targetY - spider.y) * 0.01;
      spider.velX *= 0.9; // damping
      spider.velY *= 0.9;
      spider.x += spider.velX;
      spider.y += spider.velY;
      spider.angle = Math.atan2(spider.velY, spider.velX);

      // update legs: if a foot has drifted too far from its resting spot, step it forward
      legs.forEach((leg) => {
        const restX = spider.x + Math.cos(leg.angle + spider.angle) * (LEG_LENGTH_1 + LEG_LENGTH_2 * 0.6);
        const restY = spider.y + Math.sin(leg.angle + spider.angle) * (LEG_LENGTH_1 + LEG_LENGTH_2 * 0.6);
        const distFromRest = Math.hypot(leg.x - restX, leg.y - restY);

        if (distFromRest > STEP_DISTANCE && !leg.moving) {
          leg.moving = true;
          leg.targetX = restX + Math.cos(leg.angle) * 10;
          leg.targetY = restY + Math.sin(leg.angle) * 10;
        }

        if (leg.moving) {
          leg.x += (leg.targetX - leg.x) * STEP_SPEED;
          leg.y += (leg.targetY - leg.y) * STEP_SPEED;
          if (Math.hypot(leg.targetX - leg.x, leg.targetY - leg.y) < 1) {
            leg.moving = false;
          }
        }
      });

      // draw legs (behind the body)
      legs.forEach((leg) => {
        drawLeg(spider.x, spider.y, leg.x, leg.y);
      });

      // draw body
      ctx.fillStyle = "#2b1d14";
      ctx.beginPath();
      ctx.arc(spider.x, spider.y, spider.bodyRadius, 0, Math.PI * 2);
      ctx.fill();

      // draw head, offset slightly in the direction of travel
      const headX = spider.x + Math.cos(spider.angle) * (spider.bodyRadius + 4);
      const headY = spider.y + Math.sin(spider.angle) * (spider.bodyRadius + 4);
      ctx.beginPath();
      ctx.arc(headX, headY, spider.headRadius, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    // cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} width={800} height={600} style={{ background: "#f4f4f4" }} />;
}

export default App;