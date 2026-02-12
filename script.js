const {
  Engine, World, Bodies, Body, Constraint,
  Render, Runner, Events
} = Matter;

// ENGINE
const engine = Engine.create();
const world = engine.world;

// CANVAS
const canvas = document.getElementById("c");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

// RENDER (физику не рисуем)
const render = Render.create({
  engine,
  canvas,
  options: {
    width: canvas.width,
    height: canvas.height,
    wireframes: false,
    background: "transparent"
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// GROUND
World.add(world,
  Bodies.rectangle(
    canvas.width / 2,
    canvas.height - 20,
    canvas.width,
    40,
    { isStatic: true }
  )
);

// ==========================
// 🔩 RAGDOLL (НЕВИДИМЫЙ)
// ==========================

// TORSO — якорь
const torso = Bodies.rectangle(500, 300, 60, 120, {
  mass: 2,
  render: { visible: false }
});

// HEAD
const head = Bodies.circle(500, 220, 25, {
  mass: 0.5,
  render: { visible: false }
});

// LIMBS (условные)
const leftLeg = Bodies.rectangle(480, 430, 30, 100, {
  mass: 1,
  render: { visible: false }
});

const rightLeg = Bodies.rectangle(520, 430, 30, 100, {
  mass: 1,
  render: { visible: false }
});

// JOINTS
const joints = [
  Constraint.create({
    bodyA: head,
    bodyB: torso,
    pointA: { x: 0, y: 20 },
    pointB: { x: 0, y: -60 },
    stiffness: 0.6
  }),

  Constraint.create({
    bodyA: torso,
    bodyB: leftLeg,
    pointA: { x: -15, y: 60 },
    pointB: { x: 0, y: -40 },
    stiffness: 0.6
  }),

  Constraint.create({
    bodyA: torso,
    bodyB: rightLeg,
    pointA: { x: 15, y: 60 },
    pointB: { x: 0, y: -40 },
    stiffness: 0.6
  })
];

World.add(world, [torso, head, leftLeg, rightLeg, ...joints]);

// ==========================
// 🖼 ОБОЛОЧКА (ОДНА PNG)
// ==========================

const img = new Image();
img.src = "assets/soldier.png";

// размеры PNG (подгони под свою)
const IMG_W = 140;
const IMG_H = 260;

// каждый кадр — рисуем картинку поверх физики
Events.on(render, "afterRender", () => {
  ctx.save();

  // позиция и угол берутся ТОЛЬКО с торса
  ctx.translate(torso.position.x, torso.position.y);
  ctx.rotate(torso.angle);

  ctx.drawImage(
    img,
    -IMG_W / 2,
    -IMG_H / 2,
    IMG_W,
    IMG_H
  );

  ctx.restore();
});
    
