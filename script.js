const { Engine, World, Bodies, Body, Constraint, Runner } = Matter;

const engine = Engine.create();
engine.world.gravity.y = 1;
const world = engine.world;
Runner.run(Runner.create(), engine);

const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

let flips = 0;
const counter = document.getElementById("counter");

const groundHeight = 40;
const groundY = canvas.height / 2 + 200;
const ground = Bodies.rectangle(canvas.width/2, groundY, canvas.width, groundHeight, { isStatic:true });
World.add(world, ground);

// =====================
// Загрузка изображений
// =====================
const images = {
  head: loadImg("assets/head_helmet.png"),
  torso: loadImg("assets/torso_armor.png"),
  leftArm: loadImg("assets/left_arm.png"),
  rightArm: loadImg("assets/right_arm.png"),
  leftLeg: loadImg("assets/left_leg.png"),
  rightLeg: loadImg("assets/right_leg.png"),
  ground: loadImg("assets/ground.png")
};

function loadImg(src){
  const img = new Image();
  img.src = src;
  return img;
}

// =====================
// Размеры (под PNG 2048)
// =====================
const scale = 0.25; // уменьшаем под экран

const partsSize = {
  torso: { w: 500*scale, h: 700*scale },
  head: { w: 400*scale, h: 400*scale },
  leftArm: { w: 350*scale, h: 400*scale },
  rightArm: { w: 350*scale, h: 400*scale },
  leftLeg: { w: 250*scale, h: 450*scale },
  rightLeg: { w: 250*scale, h: 450*scale }
};

// =====================
// Создание ragdoll
// =====================
let torso, head, leftArm, rightArm, leftLeg, rightLeg;

function setupRagdoll(){
  const cx = canvas.width/2;
  const cy = canvas.height/2;

  torso = Bodies.rectangle(cx, cy, partsSize.torso.w, partsSize.torso.h, { mass:2, frictionAir:0.04 });
  head  = Bodies.circle(cx, cy - 180*scale, partsSize.head.w/2, { mass:0.6 });
  leftArm  = Bodies.rectangle(cx - 200*scale, cy - 50*scale, partsSize.leftArm.w, partsSize.leftArm.h, { mass:0.8 });
  rightArm = Bodies.rectangle(cx + 200*scale, cy - 50*scale, partsSize.rightArm.w, partsSize.rightArm.h, { mass:0.8 });
  leftLeg  = Bodies.rectangle(cx - 80*scale, cy + 250*scale, partsSize.leftLeg.w, partsSize.leftLeg.h, { mass:0.9 });
  rightLeg = Bodies.rectangle(cx + 80*scale, cy + 250*scale, partsSize.rightLeg.w, partsSize.rightLeg.h, { mass:0.9 });

  World.add(world, [torso, head, leftArm, rightArm, leftLeg, rightLeg]);

  World.add(world, [
    Constraint.create({ bodyA: head, bodyB: torso, pointA:{x:0,y:50*scale}, pointB:{x:0,y:-300*scale}, stiffness:0.6 }),
    Constraint.create({ bodyA: leftArm, bodyB: torso, pointA:{x:0,y:-150*scale}, pointB:{x:-200*scale,y:-200*scale}, stiffness:0.6 }),
    Constraint.create({ bodyA: rightArm, bodyB: torso, pointA:{x:0,y:-150*scale}, pointB:{x:200*scale,y:-200*scale}, stiffness:0.6 }),
    Constraint.create({ bodyA: leftLeg, bodyB: torso, pointA:{x:0,y:-200*scale}, pointB:{x:-100*scale,y:300*scale}, stiffness:0.6 }),
    Constraint.create({ bodyA: rightLeg, bodyB: torso, pointA:{x:0,y:-200*scale}, pointB:{x:100*scale,y:300*scale}, stiffness:0.6 })
  ]);
}

setupRagdoll();

// =====================
// LOOP
// =====================
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(images.ground.complete){
    ctx.drawImage(images.ground, 0, groundY, canvas.width, groundHeight);
  } else {
    ctx.fillStyle = "#2f7d32";
    ctx.fillRect(0, groundY, canvas.width, groundHeight);
  }

  drawBodyPart(torso, images.torso, partsSize.torso);
  drawBodyPart(head, images.head, partsSize.head);
  drawBodyPart(leftArm, images.leftArm, partsSize.leftArm);
  drawBodyPart(rightArm, images.rightArm, partsSize.rightArm);
  drawBodyPart(leftLeg, images.leftLeg, partsSize.leftLeg);
  drawBodyPart(rightLeg, images.rightLeg, partsSize.rightLeg);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

// =====================
// Рисование
// =====================
function drawBodyPart(body, img, size){
  if(!img.complete) return;

  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle);
  ctx.drawImage(img, -size.w/2, -size.h/2, size.w, size.h);
  ctx.restore();
}

// =====================
// Флип
// =====================
let onFlip = false;

canvas.addEventListener('mousedown', doFlip);
canvas.addEventListener('touchstart', doFlip);

function doFlip(){
  if(onFlip) return;
  onFlip = true;

  Body.setVelocity(torso,{x:0,y:-25});
  Body.setAngularVelocity(torso,2);
  Body.setAngularVelocity(leftArm,3);
  Body.setAngularVelocity(rightArm,-3);
  Body.setAngularVelocity(leftLeg,2);
  Body.setAngularVelocity(rightLeg,-2);

  flips++;
  counter.innerText = "Сальто: " + flips;

  setTimeout(()=>onFlip=false,800);
    }
                              
