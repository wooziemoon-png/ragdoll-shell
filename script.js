const { Engine, World, Bodies, Constraint, Runner } = Matter;

// ==================
// ENGINE
// ==================
const engine = Engine.create();
engine.world.gravity.y = 0; // отключаем гравитацию
const world = engine.world;
Runner.run(Runner.create(), engine);

// ==================
// CANVAS
// ==================
const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// ==================
// Платформа (невидимая) для солдата
// ==================
const groundY = canvas.height / 2 + 130; // чуть ниже центра, чтобы солдат стоял
const ground = Bodies.rectangle(
  canvas.width / 2,
  groundY,
  canvas.width,
  10,
  { isStatic: true }
);
World.add(world, ground);

// ==================
// RAGDOLL (НЕВИДИМЫЙ)
// ==================
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const torso = Bodies.rectangle(centerX, centerY, 60, 120, { mass: 2 });
const head  = Bodies.circle(centerX, centerY - 80, 25, { mass: 0.5 });

World.add(world, [torso, head]);

World.add(world,
  Constraint.create({
    bodyA: head,
    bodyB: torso,
    pointA: { x: 0, y: 20 },
    pointB: { x: 0, y: -60 },
    stiffness: 0.6
  })
);

// ==================
// IMAGE
// ==================
const img = new Image();
img.src = "assets/soldier.png";

img.onload = () => {
  requestAnimationFrame(loop);
};

// ==================
// LOOP
// ==================
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(torso.position.x, torso.position.y);
  ctx.rotate(torso.angle);

  ctx.drawImage(
    img,
    -70,
    -130,
    140,
    260
  );

  ctx.restore();

  requestAnimationFrame(loop);
}

// ==================
// CLICK / TOUCH для сальто
// ==================
canvas.addEventListener('touchstart', doFlip);
canvas.addEventListener('mousedown', doFlip);

function doFlip() {
  // небольшая гравитация на время сальто
  engine.world.gravity.y = 1;

  // импульс вверх
  Matter.Body.applyForce(
    torso,
    { x: torso.position.x, y: torso.position.y },
    { x: 0, y: -0.08 }
  );

  // вращение (сальто)
  Matter.Body.setAngularVelocity(torso, 0.3);

  // через 1.5 сек возвращаем гравитацию в 0
  setTimeout(() => { engine.world.gravity.y = 0; }, 1500);
}
