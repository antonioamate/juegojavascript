let player, enemies, interval, ctx, canvas, backgroundImage, projectiles, keys, paused, fps, gravity, frame, killCount, wave, escaped;
const blocks = [
  new Block({
    x: 0,
    y: 370,
    width: 400,
    height: 20,
  }),
  new Block({
    x: 288,
    y: 203,
    width: 405,
    height: 20,
  }),
  new Block({
    x: 590,
    y: 370,
    width: 395,
    height: 20,
  }),
];

const playerDeathSounds = ["wasted", "windowsxp", "mariodeath", "astronomia", "funeral", "justdeath", "rickroll", "coolstory", "estudiar"];
const enemyDeathSounds = ["death-skeleton"];
const enemyHitSounds = ["hurt1-skeleton", "hurt2-skeleton", "hurt3-skeleton", "hurt4-skeleton"];
const playerHitSounds = ["minecrafthit", "punch", "minecraft-hurt"];
const jumpSounds = ["mariojump"];
const bulletWoodSounds = ["bulletwood"];
const newWaveSounds = ["anenemy"];
const newGameSounds = ["herewegoagain"];
const beggingSounds = ["nogod"];

function randomSound(array) {
  let index = Math.floor(Math.random() * array.length);
  const audio = new Audio("./sounds/" + array[index] + ".mp3");
  audio.play();
}

function newGame() {
  
  escaped = 0;
  wave = 0;
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
  
  projectiles = [];
  paused = false;
  player = new Player();
}
function newWave() {

  randomSound(newWaveSounds);
  wave++;
  for (let i = 0; i < wave; i++) {
    enemies.push(new Enemy());
  }
}

//BARRERAS INVISIBLES
function checkGameBorders(object) {
  if (object.y + object.height + object.speed.y >= 540) {
    object.y = 540 - object.height;
    object.speed.y = 0;
    object.onGround = true;
  }
  if (object instanceof Player) {
    if (object.x + object.speed.x < 0) {
      object.x = 0;
      object.speed.x = 0;
    }
    if (object.x + object.width + object.speed.x >= 1280) {
      object.x = 1280 - object.width;
      object.speed.x = 0;
    }
  }

  if (object instanceof Enemy && (object.x + object.width < 0 || object.x > 1280)) {
    escaped++
    removeEnemy(object);
  }
}

//IS COLLIDING
function isColliding(o1, o2) {
  return o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y;
}

//PLAYER/ENEMY BLOCK COLLISIONS
function checkBlockCollisions(object) {
  for (const block of blocks) {
    // Colisión desde arriba
    if (object.y + object.height + object.speed.y >= block.y && object.y + object.height <= block.y && object.x + object.width >= block.x && object.x <= block.x + block.width) {
      object.y = block.y - object.height;
      object.speed.y = 0;
      object.onGround = true;
    }
  }
}

//PLAYER COLLISIONS
function checkPlayerCollisions() {
  checkGameBorders(player);
  checkBlockCollisions(player);
  checkPlayerEnemyCollisions();
}
//PLAYER ENEMY COLLISION
function checkPlayerEnemyCollisions() {
  for (const enemy of enemies) {
    if (!enemy.dead) {
      if (isColliding(player, enemy)) {
        //comprobar si el enemigo nos ha hecho daño hace más de medio segundo
        if (frame - enemy.lastBite > 30) {
          //morder al jugador
          console.log("player got bite");
          randomSound(playerHitSounds)
          enemy.lastBite = frame;
          player.health -= 20;
          //dependiendo de la posición del jugador con respecto al enemigo
          //se empuja al jugador a la izquierda o la derecha y siempre un poco hacia arriba
          if (player.x > enemy.x) {
            player.speed.x += 30;
            player.speed.y -= 5;
          } else {
            player.speed.x -= 30;

            player.speed.y -= 5;
          }
        }
      }
    }
  }
}

//ENEMY COLLISIONS
//llamar a esta funcion desde el update de enemy
function checkEnemyCollisions(enemy) {
  if (!enemy.dead) {
    checkBlockCollisions(enemy);
  }
  checkGameBorders(enemy);
}

//UPDATE DRAW PROJECTILES
function updateDrawProjectiles() {
  for (const projectile of projectiles) {
    projectile.update();
    projectile.draw();
  }
  projectiles = projectiles.filter((projectile) => projectile.x > 0 && projectile.x < canvas.width && projectile.y > 0 && projectile.y < canvas.height);
}

//UPDATE DRAW ENEMIES
function updateDrawEnemies() {
  for (const enemy of enemies) {
    enemy.update();
    enemy.draw();
  }
}
//UPDATE DRAW BLOCKS
function updateDrawBlocks() {
  for (const block of blocks) {
    block.draw();
  }
}
//UPDATE DRAW PLAYER
function updateDrawPlayer() {
  player.update();
  player.draw();
}

//HANDLE KEYDOWN
function handleKeyDown(e) {
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
    case "e":
      player.currentGun.gunPistol = !player.currentGun.gunPistol;
  }
}
//HANDLE KEYUP

function handleKeyUp(e) {
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

//REMOVE ENEMY
function removeEnemy(enemy) {
  const index = enemies.indexOf(enemy);
  if (index !== -1) {
    enemies.splice(index, 1);
  }
  if (enemies.length < 1) {
    newWave();
  }
}
//REMOVE PROJECTILE
function removeProjectile(projectile) {
  const index = projectiles.indexOf(projectile);
  if (index !== -1) {
    projectiles.splice(index, 1);
  }
}
