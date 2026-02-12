const { Engine, World, Bodies, Body, Constraint, Runner, Events } = Matter;

// ==================
// ENGINE
// ==================
const engine = Engine.create();
engine.world.gravity.y = 0; // отключаем постоянную гравитацию
const world = engine.world;
Runner.run(Runner.create(), engine);

const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// ==================
// Счётчик сальто
// ==================
let flips = 0;
const counter = document.getElementById("counter");

// ==================
// Платформа (невидимая)
const groundY = canvas.height/2 + 130;
const ground = Bodies.rectangle(canvas.width/2, groundY, canvas.width, 10, { isStatic: true });
World.add(world, ground);

// ==================
// Торс и голова
const centerX = canvas.width/2;
const centerY = canvas.height/2;
const torso = Bodies.rectangle(centerX, centerY, 60, 120, { mass:2, frictionAir:0.02 });
const head  = Bodies.circle(centerX, centerY-80, 25, { mass:0.5, frictionAir:0.02 });
World.add(world, [torso, head]);
World.add(world, Constraint.create({ bodyA: head, bodyB: torso, pointA:{x:0,y:20}, pointB:{x:0,y:-60}, stiffness:0.6 }));

// ==================
// Картинка солдата
const img = new Image();
img.src = "assets/soldier.png";
img.onload = () => requestAnimationFrame(loop);

// ==================
// Флаги для мультяшного приземления
let onFlip = false;
let landed = false;

// ==================
// LOOP
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.save();
  ctx.translate(torso.position.x, torso.position.y);
  ctx.rotate(torso.angle);
  ctx.drawImage(img,-70,-130,140,260);
  ctx.restore();

  // мультяшное приземление
  if(onFlip){
    // если торс ниже платформы — мягко ставим на землю
    const diff = (groundY - 5) - torso.position.y;
    if(diff > 0){
      Body.setVelocity(torso,{x:0, y: diff*0.2});
      Body.setAngularVelocity(torso, torso.angularVelocity*0.8); // тормозим вращение
    } else if(!landed){
      // считаем сальто
      flips++;
      counter.innerText = "Сальто: " + flips;
      landed = true;
      onFlip = false;

      // ставим ровно на землю
      Body.setPosition(torso,{x: centerX, y: groundY-130});
      Body.setAngle(torso,0);
      Body.setAngularVelocity(torso,0);
      Body.setVelocity(torso,{x:0,y:0});
    }
  }

  requestAnimationFrame(loop);
}

// ==================
// CLICK / TOUCH для сальто
canvas.addEventListener('touchstart', doFlip);
canvas.addEventListener('mousedown', doFlip);

function doFlip(){
  if(onFlip) return; // пока в воздухе — новых сальто не даём
  onFlip = true;
  landed = false;

  // мультяшный прыжок вверх
  Body.setVelocity(torso,{x:0,y:-25});
  Body.setAngularVelocity(torso,1.2);
}
