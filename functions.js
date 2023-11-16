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
//IS COLLIDING
function isColliding(object1, object2) {
  return (
    object1.position.x < object2.position.x + object2.size.width &&
    object1.position.x + object1.size.width > object2.position.x &&
    object1.position.y < object2.position.y + object2.size.height &&
    object1.position.y + object1.size.height > object2.position.y
  );
}

//PLAYER PROJECTILE
function checkPlayerProjectileCollisions() {
  for (const projectile of projectiles) {
    if (isColliding(projectile, player)) {
      // Manejar la colisión con la bala aquí
      player.health -= 20;
      removeProjectile(projectile);
    }
  }
}
//PLAYER BLOCK
function checkPlayerBlockCollisions() {
  for (const block of blocks) {
    if (isColliding(player, block)) {
      // Manejar la colisión del jugador con el bloque aquí
      console.log("colision");
      player.speed.x = -player.speed.x * 1.005;
      player.speed.y = -player.speed.y * 1.005;
    }
  }
}
//PLAYER ENEMY
function checkPlayerEnemyCollisions() {
  for (const enemy of enemies) {
    if (isColliding(player, enemy)) {
      // Manejar la colisión con el enemigo aquí
      player.health -= 20;
    }
  }
}

//ENEMY PROJECTILE
function checkEnemyProjectileCollisions() {
  for (const projectile of projectiles) {
    for (const enemy of enemies) {
      if (isColliding(projectile, enemy)) {
        enemy.health = enemy.health - 20;
        removeProjectile(projectile);
      }
    }
  }
}
//PROJECTILE BLOCK
function checkBlockProjectileCollisions() {
  for (const projectile of projectiles) {
    for (const block of blocks) {
      if (isColliding(projectile, block)) {
        removeProjectile(projectile);
      }
    }
  }
}

//ENEMY BLOCK
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
    block.update();
    block.draw();
  }
}
//UPDATE DRAW PLAYER
function updateDrawPlayer() {
  player.update();
  player.draw();
}
