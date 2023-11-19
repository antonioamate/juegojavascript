let player, enemies, interval, ctx, canvas, backgroundImage, projectiles, keys, paused, fps, gravity, frame, killCount;
const blocks = [
  new Block({
    x: 200,
    y: 440,
    width: 50,
    height: 100,
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
  projectiles = [];
  paused = false;
  player = new Player();
}

//BARRERAS INVISIBLES
function checkGameBorders(object) {
  if (object.y + object.height + object.speed.y >= 540) {
    object.y = 540 - object.height;
    object.speed.y = 0;
    object.onGround = true;
  }
  if (object.x + object.speed.x < 0) {
    object.x = 0;
    object.speed.x = 0;
  }
  if (object.x + object.width + object.speed.x >= 1280) {
    object.x = 1280 - object.width;
    object.speed.x = 0;
  }
}

//IS COLLIDING
function isColliding(o1, o2) {
  return (
    o1.x + o1.speed.x < o2.x + o2.width &&
    o1.x + o1.width + o1.speed.x > o2.x &&
    o1.y + o1.speed.y < o2.y + o2.height &&
    o1.y + o1.height + o1.speed.y > o2.y
  );
}

//PLAYER BLOCK COLLISIONS
function checkPlayerBlockCollisions() {
  for (const block of blocks) {
    // Colisión desde arriba
    if (player.speed.y > 0 && player.y + player.height + player.speed.y >= block.y && player.x + player.width >= block.x && player.x <= block.x + block.width) {
      player.y = block.y - player.height;
      player.speed.y = 0;
      player.onGround = true;
    }

    // Colisión desde la izquierda
    if (
      player.speed.x < 0 && // Verifica que el jugador se esté moviendo hacia la izquierda
      player.x + player.speed.x <= block.x + block.width && // Colisión desde la izquierda
      player.x >= block.x &&
      player.y + player.height >= block.y &&
      player.y <= block.y + block.height
    ) {
      player.x = block.x + block.width;
      player.speed.x = 0;
    }

    // Colisión desde la derecha
    if (
      player.speed.x > 0 && // Verifica que el jugador se esté moviendo hacia la derecha
      player.x + player.width + player.speed.x >= block.x && // Colisión desde la derecha
      player.x <= block.x + block.width &&
      player.y + player.height >= block.y &&
      player.y <= block.y + block.height
    ) {
      player.x = block.x - player.width;
      player.speed.x = 0;
    }
  }
}

//PLAYER COLLISIONS
function checkPlayerCollisions() {
  checkGameBorders(player);
  checkPlayerBlockCollisions();
}
//PLAYER ENEMY COLLISION
function checkPlayerEnemyCollisions() {
  for (const enemy of enemies) {
    if (isColliding(player, enemy)) {
      //comprobar si el enemigo nos ha hecho daño hace más de medio segundo
      if (frame - this.lastBite > 30) {
        //morder al jugador
        console.log("player got bite");
        enemy.lastBite = frame;
        player.health -= 5;
        //dependiendo de la posición del jugador con respecto al enemigo
        //se empuja al jugador a la izquierda o la derecha y siempre un poco hacia arriba
        if (player.x > enemy.x) {
          player.speed.x += 20;
          player.speed.y -= 20;
        } else {
          player.speed.x -= 20;
          a;
          player.speed.y -= 20;
        }
      }
    }
  }
}

//ENEMY COLLISIONS
function checkEnemyCollisions(enemy) {
  if (!enemy.dead) {
    //ENEMY PROJECTILE COLLISIONS

    //ENEMY BLOCK COLLISIONS
    for (const block of blocks) {
      if (isColliding(enemy, block)) {
        console.log("enemy block colission");
        reactToCollision(enemy, block);
      }
    }
    //ENEMY GAME BORDERS COLLISION
    checkGameBorders(enemy);
  }
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
