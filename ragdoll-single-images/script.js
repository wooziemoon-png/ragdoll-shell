const {
  Engine, Render, Runner, World,
  Bodies, Constraint
} = Matter;

const engine = Engine.create();
const world = engine.world;

// canvas
const render = Render.create({
  element: document.body,
  engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: true, // ВАЖНО: сначала включи для дебага
    background: "#222"
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// GROUND
World.add(world,
  Bodies.rectangle(
    window.innerWidth / 2,
    window.innerHeight - 20,
    window.innerWidth,
    40,
    { isStatic: true }
  )
);

// ===

