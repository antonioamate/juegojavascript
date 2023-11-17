deathSoundsPlayer=["wasted","windowsxp","mariodeath","astronomia","funeral","justdeath"]
deathSoundsEnemy=["windowsxp"]

function randomSound(array){
  let index = Math.floor(Math.random()*array.length)
  const audio = new Audio("./sounds/"+array[index]+".mp3");
  audio.play();
}

function newGame() {
  killCount = 0;
  frame = 0;
  blocks = [];
  enemies = [];
  enemies.push(new Enemy(Math.random()*1200));
  projectiles = [];
  paused = false;
  player = new Player({ position: { x: 50, y: 50 } });
}

//BARRERAS INVISIBLES
function comprobarBarrerasInvisibles(object) {
  if (object.position.y + object.speed.y > 414) {
    object.position.y = 414;
    object.speed.y = 0;
    object.onGround = true;
  }
  if (object.position.x + object.speed.x < 0) {
    object.speed.x = 0;
    object.position.x = 0;
  }
  if (object.position.x + object.size.width + object.speed.x > 1200) {
    object.speed.x = 0;
    object.position.x = 1200 - object.size.width;
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

//PLAYER BLOCK COLLISIONS
function checkPlayerBlockCollisions() {
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
//PLAYER ENEMY COLLISIONS
function checkPlayerEnemyCollisions() {
  for (const enemy of enemies) {
    if (!enemy.dead) {
      if (
        player.hitbox.position.x < enemy.hitbox.position.x + enemy.hitbox.size.width &&
        player.hitbox.position.x + player.hitbox.size.width > enemy.hitbox.position.x &&
        player.hitbox.position.y < enemy.hitbox.position.y + enemy.hitbox.size.height &&
        player.hitbox.position.y + player.hitbox.size.height > enemy.hitbox.position.y
      ) {
        // Manejar la colisión con el enemigo aquí
        player.health -= 1;
        console.log(player.health);
      }
    }
  }
}

//ENEMY PROJECTILE COLLISIONS
function checkEnemyProjectileCollisions() {
  for (const projectile of projectiles) {
    for (const enemy of enemies) {
      if (
        projectile.hitbox.position.x < enemy.hitbox.position.x + enemy.hitbox.size.width &&
        projectile.hitbox.position.x + projectile.hitbox.size.width > enemy.hitbox.position.x &&
        projectile.hitbox.position.y < enemy.hitbox.position.y + enemy.hitbox.size.height &&
        projectile.hitbox.position.y + projectile.hitbox.size.height > enemy.hitbox.position.y
      ) {
        enemy.health = enemy.health - 20;
        removeProjectile(projectile);
        console.log("enemigo alcanzado");
      }
    }
  }
}
//PROJECTILE BLOCK COLLISIONS
function checkBlockProjectileCollisions() {
  for (const projectile of projectiles) {
    for (const block of blocks) {
      if (isColliding(projectile, block)) {
        removeProjectile(projectile);
      }
    }
  }
}

//ENEMY BLOCK COLLISIONS
function checkBlockEnemyCollisions() {
  for (const enemy of enemies) {
    for (const block of blocks) {
      if (isColliding(enemy, block)) {
      }
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
//CHECK COLLISIONS
function checkAllCollisions() {
  checkEnemyProjectileCollisions();
  checkBlockEnemyCollisions();
  checkBlockProjectileCollisions();
  checkPlayerBlockCollisions();
  checkPlayerEnemyCollisions();
}
