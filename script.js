const { Engine, World, Bodies, Body, Constraint, Runner } = Matter;

// ==================
// ENGINE
// ==================
const engine = Engine.create();
engine.world.gravity.y = 0; // отключаем гравитацию
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
// Платформа (невидимая)
const groundY = canvas.height/2 + 130;
const ground = Bodies.rectangle(canvas.width/2, groundY, canvas.width, 10, { isStatic: true });
World.add(world, ground);

// ==================
// Bounding box частей солдата в PNG
// Формат: {x, y, w, h} в исходном файле PNG
const partsBox = {
  torso: {x:0, y:0, w:60, h:120},
  head: {x:70, y:0, w:50, h:50},
  leftArm: {x:0, y:130, w:20, h:60},
  rightArm: {x:40, y:130, w:20, h:60},
  leftLeg: {x:10, y:200, w:20, h:60},
  rightLeg: {x:30, y:200, w:20, h:60}
};

// ==================
// Создаем отдельные тела
const centerX = canvas.width/2;
const centerY = canvas.height/2;

const torso = Bodies.rectangle(centerX, centerY, partsBox.torso.w, partsBox.torso.h, { mass:2, frictionAir:0.02 });
const head  = Bodies.circle(centerX, centerY - 80, partsBox.head.w/2, { mass:0.5, frictionAir:0.02 });

const leftArm  = Bodies.rectangle(centerX-50, centerY-20, partsBox.leftArm.w, partsBox.leftArm.h, { mass:0.7, frictionAir:0.02 });
const rightArm = Bodies.rectangle(centerX+50, centerY-20, partsBox.rightArm.w, partsBox.rightArm.h, { mass:0.7, frictionAir:0.02 });

const leftLeg  = Bodies.rectangle(centerX-20, centerY+80, partsBox.leftLeg.w, partsBox.leftLeg.h, { mass:0.7, frictionAir:0.02 });
const rightLeg = Bodies.rectangle(centerX+20, centerY+80, partsBox.rightLeg.w, partsBox.rightLeg.h, { mass:0.7, frictionAir:0.02 });

World.add(world, [torso, head, leftArm, rightArm, leftLeg, rightLeg]);

// ==================
// Constraints (соединяем части)
World.add(world, [
  Constraint.create({ bodyA: head, bodyB: torso, pointA:{x:0,y:25}, pointB:{x:0,y:-60}, stiffness:0.6 }),
  Constraint.create({ bodyA: leftArm, bodyB: torso, pointA:{x:0,y:-30}, pointB:{x:-30,y:-40}, stiffness:0.6 }),
  Constraint.create({ bodyA: rightArm, bodyB: torso, pointA:{x:0,y:-30}, pointB:{x:30,y:-40}, stiffness:0.6 }),
  Constraint.create({ bodyA: leftLeg, bodyB: torso, pointA:{x:0,y:-30}, pointB:{x:-15,y:60}, stiffness:0.6 }),
  Constraint.create({ bodyA: rightLeg, bodyB: torso, pointA:{x:0,y:-30}, pointB:{x:15,y:60}, stiffness:0.6 })
]);

// ==================
// Загружаем PNG
const img = new Image();
img.src = "assets/soldier.png";

let onFlip = false;
let landed = false;

img.onload = () => requestAnimationFrame(loop);

// ==================
// LOOP
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // рисуем каждую часть
  drawPart(head, partsBox.head);
  drawPart(torso, partsBox.torso);
  drawPart(leftArm, partsBox.leftArm);
  drawPart(rightArm, partsBox.rightArm);
  drawPart(leftLeg, partsBox.leftLeg);
  drawPart(rightLeg, partsBox.rightLeg);

  // мультяшное приземление (сглаживание)
  if(onFlip){
    const diff = (groundY - 5) - torso.position.y;
    if(diff > 0){
      Body.setVelocity(torso,{x:0, y: diff*0.2});
      Body.setAngularVelocity(torso, torso.angularVelocity*0.8);
    } else if(!landed){
      flips++;
      counter.innerText = "Сальто: " + flips;
      landed = true;
      onFlip = false;

      // фиксируем туловище на земле
      Body.setPosition(torso,{x: centerX, y: groundY - 130});
      Body.setAngle(torso,0);
      Body.setAngularVelocity(torso,0);
      Body.setVelocity(torso,{x:0,y:0});
    }
  }

  requestAnimationFrame(loop);
}

// ==================
// Функция рисования части
function drawPart(body, box){
  ctx.save();
  ctx.translate(body.position.x, body.position.y);
  ctx.rotate(body.angle);
  ctx.drawImage(
    img,
    box.x, box.y, box.w, box.h,   // вырезаем из PNG
    -box.w/2, -box.h/2, box.w, box.h  // рисуем по центру тела
  );
  ctx.restore();
}

// ==================
// Клик / Touch для сальто
canvas.addEventListener('touchstart', doFlip);
canvas.addEventListener('mousedown', doFlip);

function doFlip(){
  if(onFlip) return;
  onFlip = true;
  landed = false;

  // импульс вверх
  Body.setVelocity(torso,{x:0,y:-25});
  Body.setAngularVelocity(torso,1.2);

  // руки и ноги немного “разлетаются”
  Body.setAngularVelocity(leftArm, 1.5);
  Body.setAngularVelocity(rightArm, -1.5);
  Body.setAngularVelocity(leftLeg, 1.0);
  Body.setAngularVelocity(rightLeg, -1.0);
                }
