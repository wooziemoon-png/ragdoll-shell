const {
  Engine, World, Bodies, Constraint, Runner
} = Matter;

// ==================
// ENGINE
// ==================
const engine = Engine.create();
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
// GROUND
// ==================
World.add(world,
  Bodies.rectangle(
    canvas.width / 2,
    canvas.height - 20,
    canvas.width,
    40,
    { isStatic: true }
  )
);

// ==================
// RAGDOLL (НЕВИДИМ)
// ==================
const torso = Bodies.rectangle(500, 300, 60, 120, { mass: 2 });
const head  = Bodies.circle(500, 220, 25, { mass: 0.5 });

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
// LOOP (как в Python)
// ==================
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(torso.position.x, torso.position.y);
  ctx.rotate(torso.angle);

  ctx.drawImage(
    img,
    -70,  // половина ширины
    -130, // половина высоты
    140,
    260
  );

  ctx.restore();

  requestAnimationFrame(loop);
}
