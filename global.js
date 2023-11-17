import Block from "./model/block.js";
import Player from "./model/player.js";
import Keys from "./model/keys.js";
import Enemy from "./model/enemy.js";
import Projectile from "./model/projectile.js";

export let player,
  enemies,
  interval,
  ctx,
  canvas,
  backgroundImage,
  projectiles,
  keys,
  paused,
  fps,
  gravity,
  frame,
  killCount;
export const blocks = [
  new Block({
    position: { x: 400, y: 440 },
    size: { width: 50, height: 100 },
  }),
  new Block({
    position: { x: 200, y: 200 },
    size: { width: 50, height: 100 },
  }),
];

export const playerDeathSounds = [
  "wasted",
  "windowsxp",
  "mariodeath",
  "astronomia",
  "funeral",
  "justdeath",
  "rickroll",
  "coolstory",
  "estudiar",
];
export const enemyDeathSounds = ["windowsxp"];
export const jumpSounds = ["mariojump", "uwu", "kasumi-jump"];

export function randomSound(array) {
  let index = Math.floor(Math.random() * array.length);
  const audio = new Audio("./sounds/" + array[index] + ".mp3");
  audio.play();
}

export function newGame() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  backgroundImage = new Image();
  backgroundImage.src = "./img/forest.jpg";
  keys = new Keys();
  fps = 60;
  gravity = 0.3;
  killCount = 0;
  frame = 0;
  enemies = [];
  enemies.push(new Enemy());
  projectiles = [];
  paused = false;
  player = new Player();
}

//BARRERAS INVISIBLES
export function comprobarBarrerasInvisibles(object) {
  if (object.hitbox.position.y + object.speed.y > 414) {
    object.hitbox.position.y = 414;
    object.speed.y = 0;
    object.onGround = true;
  }
  if (object.hitbox.position.x + object.speed.x < 0) {
    object.speed.x = 0;
    object.hitbox.position.x = 0;
  }
  if (object.hitbox.position.x + object.hitbox.size.width + object.speed.x > 1280) {
    object.speed.x = 0;
    object.hitbox.position.x = 1280 - object.hitbox.size.width;
  }
}

//REMOVE ENEMY
export function removeEnemy(enemy) {
  const index = enemies.indexOf(enemy);
  if (index !== -1) {
    enemies.splice(index, 1);
  }
}
//REMOVE PROJECTILE
export function removeProjectile(projectile) {
  const index = projectiles.indexOf(projectile);
  if (index !== -1) {
    projectiles.splice(index, 1);
  }
}

//PLAYER BLOCK COLLISIONS
export function checkPlayerBlockCollisions() {
  for (const block of blocks) {
    if (
      player.hitbox.position.x + player.speed.x < block.position.x + block.size.width &&
      player.hitbox.position.x + player.hitbox.size.width + player.speed.x > block.position.x &&
      player.hitbox.position.y < block.position.y + block.size.height &&
      player.hitbox.position.y + player.hitbox.size.height > block.position.y
    ) {
      // Manejar la colisión del jugador con el bloque aquí
      console.log("colision");
      player.speed.x = 0;
      player.speed.y = 0;
    }
  }
}

//ENEMY PROJECTILE COLLISIONS
export function checkEnemyProjectileCollisions() {
  for (const projectile of projectiles) {
    for (const enemy of enemies) {
      if (!enemy.dead) {
        if (
          projectile.hitbox.position.x < enemy.hitbox.position.x + enemy.hitbox.size.width &&
          projectile.hitbox.position.x + projectile.hitbox.size.width > enemy.hitbox.position.x &&
          projectile.hitbox.position.y < enemy.hitbox.position.y + enemy.hitbox.size.height &&
          projectile.hitbox.position.y + projectile.hitbox.size.height > enemy.hitbox.position.y
        ) {
          enemy.health -= projectile.damage;
          removeProjectile(projectile);
          console.log("enemigo alcanzado");
        }
      }
    }
  }
}

//UPDATE DRAW PROJECTILES
export function updateDrawProjectiles() {
  for (const projectile of projectiles) {
    projectile.update();
    projectile.draw();
  }
  projectiles = projectiles.filter(
    (projectile) =>
      projectile.position.x > 0 &&
      projectile.position.x < canvas.width &&
      projectile.position.y > 0 &&
      projectile.position.y < canvas.height
  );
}
//UPDATE DRAW ENEMIES
export function updateDrawEnemies() {
  for (const enemy of enemies) {
    enemy.update();
    enemy.draw();
  }
}
//UPDATE DRAW BLOCKS
export function updateDrawBlocks() {
  for (const block of blocks) {
    block.draw();
  }
}
//UPDATE DRAW PLAYER
export function updateDrawPlayer() {
  player.update();
  player.draw();
}
//CHECK COLLISIONS
export function checkAllCollisions() {
  checkEnemyProjectileCollisions();
}
//HANDLE KEYDOWN
export function handleKeyDown(e) {
  switch (e.key) {
    case "w":
      keys.w = true;
      break;
    case "a":
      keys.a = true;
      break;
    case "s":
      keys.s = true;
      break;
    case "d":
      keys.d = true;
      break;
    case "p":
      paused = !paused;
  }
}
//HANDLE KEYUP

export function handleKeyUp(e) {
  switch (e.key) {
    case "w":
      keys.w = false;
      break;
    case "a":
      keys.a = false;
      break;
    case "s":
      keys.s = false;
      break;
    case "d":
      keys.d = false;
      break;
  }
}
export function handleScroll(e) {
  let delta = e.deltaY;
  console.log(delta);
}
