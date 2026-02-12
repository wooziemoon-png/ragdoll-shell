const { Engine, World, Bodies, Body, Constraint, Runner } = Matter;

// ==================
// ENGINE
// ==================
const engine = Engine.create();
engine.world.gravity.y = 1; // вниз
const world = engine.world;
Runner.run(Runner.create(), engine);

const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// ==================
// Счётчик сальто
let flips = 0;
const counter = document.getElementById("counter");

// ==================
// Земля
const groundHeight = 20;
const groundY = canvas.height / 2 + 130;
const ground = Bodies.rectangle(canvas.width / 2, groundY, canvas.width, groundHeight, { isStatic:true });
World.add(world, ground);

// ==================
// Загружаем PNG
const img = new Image();
img.src = "assets/soldier.png";
const groundImg = new Image();
groundImg.src = "assets/ground.png";

let imagesLoaded = 0;
let onFlip = false;

function checkAllLoaded() {
  imagesLoaded++;
  if(imagesLoaded === 2){
    setupRagdoll();
    requestAnimationFrame(loop);
  }
}

img.onload = checkAllLoaded;
groundImg.onload = checkAllLoaded;
img.onerror = ()=>console.log("Не загрузился soldier.png ❌");
groundImg.onerror = ()=>console.log("Не загрузился ground.png ❌");

// ==================
// Bounding box частей солдата
const partsBox = {
  torso: { x:45, y:50, w:60, h:120 },
  head: { x:45, y:0, w:60, h:50 },
  leftArm: { x:0, y:50, w:45, h:60 },
  rightArm: { x:105, y:50, w:45, h:60 },
  leftLeg: { x:45, y:170, w:25, h:90 },
  rightLeg: { x:80, y:170, w:25, h:90 }
};

// ==================
// Создаем ragdoll
let torso, head, leftArm, rightArm, leftLeg, rightLeg;

function setupRagdoll(){
  const cx = canvas.width/2;
  const cy = canvas.height/2;

  torso = Bodies.rectangle(cx, cy, partsBox.torso.w, partsBox.torso.h, { mass:2, frictionAir:0.05, restitution:0.3 });
  head  = Bodies.circle(cx, cy - 80, partsBox.head.w/2, { mass:0.5, frictionAir:0.05, restitution:0.3 });
  leftArm  = Bodies.rectangle(cx - 50, cy - 20, partsBox.leftArm.w, partsBox.leftArm.h, { mass:0.7, frictionAir:0.05 });
  rightArm = Bodies.rectangle(cx + 50, cy - 20, partsBox.rightArm.w, partsBox.rightArm.h, { mass:0.7, frictionAir:0.05 });
  leftLeg  = Bodies.rectangle(cx - 20, cy + 80, partsBox.leftLeg.w, partsBox.leftLeg.h, { mass:0.7, frictionAir:0.05 });
  rightLeg = Bodies.rectangle(cx + 20, cy + 80, partsBox.rightLeg.w, partsBox.rightLeg.h, { mass:0.7, frictionAir:0.05 });

  World.add(world, [torso, head, leftArm, rightArm, leftLeg, rightLeg]);

  // constraints
  World.add(world, [
    Constraint.create({ bodyA: head, bodyB: torso, pointA:{x:0,y:25}, pointB:{x:0,y:-60}, stiffness:0.6 }),
    Constraint.create({ bodyA: leftArm, bodyB: torso, pointA:{x:0,y:-30}, pointB:{x:-30,y:-40}, stiffness:0.6 }),
    Constraint.create({ bodyA: rightArm, bodyB: torso, pointA:{x:0,y:-30}, pointB:{x:30,y:-40}, stiffness:0.6 }),
    Constraint.create({ bodyA: leftLeg, bodyB: torso, pointA:{x:0,y:-30}, pointB:{x:-15,y:60}, stiffness:0.6 }),
    Constraint.create({ bodyA: rightLeg, bodyB: torso, pointA:{x:0,y:-30}, pointB:{x:15,y:60}, stiffness:0.6 })
  ]);
}

// ==================
// LOOP
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // земля
  if(groundImg.complete){
    ctx.drawImage(groundImg, 0, groundY, canvas.width, groundHeight);
  } else {
    ctx.fillStyle = "green";
    ctx.fillRect(0, groundY, canvas.width, groundHeight);
  }

  // части тела
  drawPart(head, partsBox.head);
  drawPart(torso, partsBox.torso);
  drawPart(leftArm, partsBox.leftArm);
  drawPart(rightArm, partsBox.rightArm);
  drawPart(leftLeg, partsBox.leftLeg);
  drawPart(rightLeg, partsBox.rightLeg);

  // приземление и счётчик
  [torso,leftLeg,rightLeg].forEach(body=>{
    const diff = groundY - (body.position.y + 30);
    if(diff < 0 && body.velocity.y > 0){
      Body.setVelocity(body,{x:body.velocity.x, y:-body.velocity.y*0.3});
      Body.setAngularVelocity(body, body.angularVelocity*0.5);
      if(onFlip){
        flips++;
        counter.innerText = "Сальто: " + flips;
        onFlip = false;
      }
    }
  });

  requestAnimationFrame(loop);
}

// ==================
// drawPart
function drawPart(body, box){
  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle);
  ctx.drawImage(img, box.x, box.y, box.w, box.h, -box.w/2, -box.h/2, box.w, box.h);
  ctx.restore();
}

// ==================
// клик / тап для сальто
canvas.addEventListener('touchstart', doFlip);
canvas.addEventListener('mousedown', doFlip);

function doFlip(){
  if(onFlip) return;
  onFlip = true;

  Body.setVelocity(torso,{x:0,y:-25});
  Body.setAngularVelocity(torso,1.5);
  Body.setAngularVelocity(leftArm, 2);
  Body.setAngularVelocity(rightArm, -2);
  Body.setAngularVelocity(leftLeg, 1);
  Body.setAngularVelocity(rightLeg, -1.5);
}
