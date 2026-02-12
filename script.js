const { Engine, World, Bodies, Body, Runner } = Matter;

// =====================
// PIXI (WebGL)
// =====================
const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x1e2f45
});
document.body.appendChild(app.view);

// =====================
// Matter
// =====================
const engine = Engine.create();
engine.gravity.y = 1.6;
engine.gravity.scale = 0.001;
Runner.run(Runner.create(), engine);

const world = engine.world;

// =====================
// Ground
// =====================
const groundY = window.innerHeight - 80;
const ground = Bodies.rectangle(window.innerWidth/2, groundY, window.innerWidth, 100, {isStatic:true});
World.add(world, ground);

// =====================
// Textures
// =====================
const textures = {
  torso: PIXI.Texture.from("assets/torso_armor.png"),
  head: PIXI.Texture.from("assets/head_helmet.png"),
  leftArm: PIXI.Texture.from("assets/left_arm.png"),
  rightArm: PIXI.Texture.from("assets/right_arm.png"),
  leftLeg: PIXI.Texture.from("assets/left_leg.png"),
  rightLeg: PIXI.Texture.from("assets/right_leg.png"),
  vest: PIXI.Texture.from("assets/vest.png") // окрема екіпіровка
};

// =====================
// Bodies
// =====================
const cx = window.innerWidth/2;
const cy = window.innerHeight/2 - 200;

const torso = Bodies.rectangle(cx, cy, 120, 200,{mass:3});
const head = Bodies.circle(cx, cy-140,40,{mass:1});
const leftLeg = Bodies.rectangle(cx-30,cy+150,40,150);
const rightLeg = Bodies.rectangle(cx+30,cy+150,40,150);

World.add(world,[torso,head,leftLeg,rightLeg]);

// =====================
// Sprites
// =====================
function sprite(tex){
  const s = new PIXI.Sprite(tex);
  s.anchor.set(0.5);
  app.stage.addChild(s);
  return s;
}

const sTorso = sprite(textures.torso);
const sHead = sprite(textures.head);
const sLeftLeg = sprite(textures.leftLeg);
const sRightLeg = sprite(textures.rightLeg);
const sVest = sprite(textures.vest); // окрема екіпіровка

// =====================
// STATE MACHINE
// =====================
let state = "IDLE";
let flips = 0;
const counter = document.getElementById("counter");

function updateState(){
  const angle = torso.angle;
  const nearVertical = Math.abs(angle) < 0.4;

  if(state === "FLIP"){
    if(torso.position.y > groundY - 120){
      if(nearVertical){
        state = "IDLE";
        Body.setAngle(torso,0);
        Body.setAngularVelocity(torso,0);
      }
    }
  }
}

// =====================
// Render loop
// =====================
app.ticker.add(()=>{

  updateState();

  sync(torso,sTorso);
  sync(head,sHead);
  sync(leftLeg,sLeftLeg);
  sync(rightLeg,sRightLeg);

  // экипировка следует за торсом
  sVest.x = sTorso.x;
  sVest.y = sTorso.y;
  sVest.rotation = sTorso.rotation;
});

function sync(body,sprite){
  sprite.x = body.position.x;
  sprite.y = body.position.y;
  sprite.rotation = body.angle;
}

// =====================
// Jump / Flip
// =====================
app.view.addEventListener("pointerdown",()=>{
  if(state !== "IDLE") return;

  state = "FLIP";
  Body.setVelocity(torso,{x:0,y:-25});
  Body.setAngularVelocity(torso,3);

  flips++;
  counter.innerText = "Сальто: " + flips;
});
