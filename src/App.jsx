import {useRef, useEffect} from "react";
function App() {
  const canvasRef =useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
let mouseY = canvas.height /2;
//spider body

const spider = {
    x: canvas.width/2,
    y:canvas.height/2,
    targetX: canvas.width /2,
    targetY : canvas.height/2,
    bodyRadius :12,
    headRadius : 8,
    speed : 0,
    angle:0,
    velX:0,
    velY:0,
};

//left configurations
const NUM_LEGS = 8;
const LEG_LENGTH_1 = 30; //upper segement
const LEG_LENGTH_2 = 35; //lower segement
const STEP_DISTANCE = 40;
const STEP_SPEED =0.3;

//leg attachment angle (relative to the body)
const legAngles = [
    -0.4, -0.8, -1.2, -1.6, //left angle
    0.4, 0.8, 1.2, 1.6 //right angle
];
  },[]);
  return <canvas ref={canvasRef} width={800} height={600}/>;

}
export default App;
