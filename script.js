const { Engine, World, Bodies, Body, Constraint, Runner, Events } = Matter;

const engine = Engine.create();
engine.gravity.y = 1.4;
engine.gravity.scale = 0.001;
const world = engine.world;

Runner.run(Runner.create(), engine);

const canvas = document.getElementById("c");
canvas.width = innerWidth;
canvas.height = innerHeight;
const ctx = canvas.getContext("2d");

let flips = 0;
const counter = document.getElementById("counter");

// =====================
// Ground
// =====================
const groundY = canvas.height - 80;
const ground = Bodies.rectangle(canvas.width/2, groundY, canvas.width, 80, {
  isStatic:true,
  friction:1
});
World.add(world, ground);

// =====================
// Load images
// =====================
function load(src){
  const i = new Image();
  i.src = src;
  return i;
}

const img = {
  head: load("assets/head_helmet.png"),
  torso: load("assets/torso_armor.png"),
  leftArm: load("assets/left_arm.png"),
  rightArm: load("assets/right_arm.png"),
  leftLeg: load("assets/left_leg.png"),
  rightLeg: load("assets/right_leg.png"),
  ground: load("assets/ground.png")
};

// =====================
// Scale (важливо)
// =====================
const S = 0.18;

// =====================
// Bodies
// =====================
const cx = canvas.width/2;
const cy = canvas.height/2 - 200;

const torso = Bodies.rectangle(cx, cy, 220*S*10, 380*S*10, {
  mass:3,
  friction:0.6,
  frictionAir:0.02,
  restitution:0.1
});

const head = Bodies.circle(cx, cy-220*S, 80*S, {
  mass:0.8,
  frictionAir:0.02
});

const leftArm = Bodies.rectangle(cx-160*S, cy-40*S, 70*S*10, 220*S*10, {
  mass:1,
  frictionAir:0.02
});

const rightArm = Bodies.rectangle(cx+160*S, cy-40*S, 70*S*10, 220*S*10, {
  mass:1,
  frictionAir:0.02
});

const leftLeg = Bodies.rectangle(cx-70*S, cy+260*S, 90*S*10, 260*S*10, {
  mass:1.2,
  friction:1
});

const rightLeg = Bodies.rectangle(cx+70*S, cy+260*S, 90*S*10, 260*S*10, {
  mass:1.2,
  friction:1
});

World.add(world,[torso,head,leftArm,rightArm,leftLeg,rightLeg]);

// =====================
// Constraints (суглоби)
// =====================
function joint(a,b,ax,ay,bx,by){
  return Constraint.create({
    bodyA:a,
    bodyB:b,
    pointA:{x:ax,y:ay},
    pointB:{x:bx,y:by},
    stiffness:0.8,
    damping:0.1,
    length:0
  });
}

World.add(world,[
  joint(head,torso,0,60*S,0,-190*S),
  joint(leftArm,torso,0,-120*S,-150*S,-150*S),
  joint(rightArm,torso,0,-120*S,150*S,-150*S),
  joint(leftLeg,torso,0,-140*S,-60*S,200*S),
  joint(rightLeg,torso,0,-140*S,60*S,200*S)
]);

// =====================
// Angle limits (реалізм)
// =====================
function limitAngle(body,min,max){
  if(body.angle < min){
    Body.setAngle(body,min);
    Body.setAngularVelocity(body,0);
  }
  if(body.angle > max){
    Body.setAngle(body,max);
    Body.setAngularVelocity(body,0);
  }
}

Events.on(engine,"beforeUpdate",()=>{
  limitAngle(leftArm,-2.2,1.2);
  limitAngle(rightArm,-1.2,2.2);
  limitAngle(leftLeg,-1.5,1.5);
  limitAngle(rightLeg,-1.5,1.5);
});

// =====================
// Draw
// =====================
function draw(body,image,w,h){
  if(!image.complete) return;

  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle);
  ctx.drawImage(image,-w/2,-h/2,w,h);
  ctx.restore();
}

function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(img.ground.complete)
    ctx.drawImage(img.ground,0,groundY-40,canvas.width,80);

  draw(torso,img.torso,400*S,600*S);
  draw(head,img.head,260*S,260*S);
  draw(leftArm,img.leftArm,180*S,420*S);
  draw(rightArm,img.rightArm,180*S,420*S);
  draw(leftLeg,img.leftLeg,220*S,500*S);
  draw(rightLeg,img.rightLeg,220*S,500*S);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// =====================
// Flip
// =====================
let canFlip=true;

canvas.addEventListener("mousedown",flip);
canvas.addEventListener("touchstart",flip);

function flip(){
  if(!canFlip) return;
  canFlip=false;

  Body.setVelocity(torso,{x:0,y:-22});
  Body.setAngularVelocity(torso,2.5);

  flips++;
  counter.innerText="Сальто: "+flips;

  setTimeout(()=>canFlip=true,900);
}
