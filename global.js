let player, enemies, interval, ctx, canvas, backgroundImage, projectiles, keys, paused, fps, gravity, frame, killCount;
const blocks = [
  new Block({
    position: { x: 400, y: 440 },
    size: { width: 50, height: 100 },
  }),
  new Block({
    position: { x: 200, y: 200 },
    size: { width: 50, height: 100 },
  }),
];

const playerDeathSounds = ["wasted", "windowsxp", "mariodeath", "astronomia", "funeral", "justdeath", "rickroll", "coolstory", "estudiar"];
const enemyDeathSounds = ["windowsxp"];
const jumpSounds = ["mariojump", "uwu", "kasumi-jump"];

function randomSound(array) {
  let index = Math.floor(Math.random() * array.length);
  const audio = new Audio("./sounds/" + array[index] + ".mp3");
  audio.play();
}

function newGame() {
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
function checkGameBorders(object) {
  console.log(object.position.x)
  if (object.position.y > 414) {
    object.position.y = 414;
    object.onGround = true;
  }
  if (object.position.x + object.hitboxOffset.x < 0) {
    object.position.x = -object.hitboxOffset.x
  }
  if (object.position.x + object.hitboxOffset.x + object.size.width + object.hitboxOffset.width > 1280) {
    object.position.x = 1280  - object.hitboxOffset.x - object.hitboxOffset.width - object.size.width
  }
}

//REMOVE ENEMY
function removeEnemy(enemy) {
  const index = enemies.indexOf(enemy);
  if (index !== -1) {
    enemies.splice(index, 1);
  }
}
//REMOVE PROJECTILE
function removeProjectile(projectile) {
  const index = projectiles.indexOf(projectile);
  if (index !== -1) {
    projectiles.splice(index, 1);
  }
}

//WILL COLLIDE?
function isColliding(o1, o2) {
  let o1auxX = o1.position.x + (o1.hitboxOffset?.x ?? 0);
  let o1auxY = o1.position.y + (o1.hitboxOffset?.y ?? 0);
  let o1auxWidth = o1.size.width + (o1.hitboxOffset?.width ?? 0);
  let o1auxHeight = o1.size.height + (o1.hitboxOffset?.height ?? 0);
  let o2auxX = o2.position.x + (o2.hitboxOffset?.x ?? 0);
  let o2auxY = o2.position.y + (o2.hitboxOffset?.y ?? 0);
  let o2auxWidth = o2.size.width + (o2.hitboxOffset?.width ?? 0);
  let o2auxHeight = o2.size.height + (o2.hitboxOffset?.height ?? 0);

  return o1auxX < o2auxX + o2auxWidth && o1auxX + o1auxWidth > o2auxX && o1auxY < o2auxY + o2auxHeight && o1auxY + o1auxHeight > o2auxY;
}


function reactToCollision(block) {
  if (player.lastPosition.y + player.lastHitboxOffset.y + player.lastHitboxOffset.height < block.position.y) {
    player.position.y = block.position.y + player.hitboxOffset.height - player.hitboxOffset.y;
    player.speed.y = 0;
  }
}

//PLAYER BLOCK COLLISIONS
function checkPlayerBlockCollisions() {
  for (const block of blocks) {
    if (isColliding(player, block)) {
      console.log("player block colission");
      reactToCollision(block);
    }
  }
}
//PLAYER COLLISIONS
function checkPlayerCollisions() {
  checkGameBorders(player);
  checkPlayerBlockCollisions();
}
//PLAYER ENEMY COLLISION
if (isColliding(player, enemy)) {
  //comprobar si el enemigo nos ha hecho daño hace más de medio segundo
  if (frame - this.lastBite > 30) {
    //morder al jugador
    console.log("player got bite");
    enemy.lastBite = frame;
    player.health -= 5;
    //dependiendo de la posición del jugador con respecto al enemigo se empuja al jugador a la izquierda o la derecha y siempre un poco hacia arriba
    if (player.position.x+player.hitboxOffset.x > enemy.hitboxOffset.x) {
      player.speed.x += 20;
      player.speed.y -= 20;
    } else {
      player.speed.x -= 20;
      player.speed.y -= 20;
    }
  }
}

//ENEMY COLLISIONS
function checkEnemyCollisions(enemy) {
  if (!enemy.dead) {
    //ENEMY PROJECTILE COLLISIONS
    for (const projectile of projectiles) {
      if (isColliding(projectile, enemy)) {
        enemy.health -= projectile.damage;
        removeProjectile(projectile);
        console.log("enemy got shot");
      }
    }

    //ENEMY BLOCK COLLISIONS
    for (const block of blocks) {
      if (isColliding(enemy, block)) {
        console.log("enemy block colission");
        enemy.speed.x = 0;
        enemy.speed.y = 0;
      }
    }
    //ENEMY GAME BORDERS COLLISION
    checkGameBorders(enemy);
  }
}
//PROJECTILE BLOCK COLLISIONS
function checkProjectileBlockCollisions(projectile) {
  for (const block of blocks) {
    if (isColliding(projectile, block)) {
      removeProjectile(projectile);
    }
  }
}

//UPDATE DRAW PROJECTILES
function updateDrawProjectiles() {
  for (const projectile of projectiles) {
    projectile.update();
    projectile.draw();
  }
  projectiles = projectiles.filter((projectile) => projectile.position.x > 0 && projectile.position.x < canvas.width && projectile.position.y > 0 && projectile.position.y < canvas.height);
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
//HANDLE SCROLL
function handleScroll(e) {
  let delta = e.deltaY;
  console.log(delta);
}
