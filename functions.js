function removeEnemy(enemy) {
    // Método para eliminar un enemigo del array de enemigos
    const index = enemies.indexOf(enemy);
    if (index !== -1) {
      enemies.splice(index, 1);
    }
    
  }
  
  function removeProjectile(projectile) {
    // Método para eliminar un proyectil del array de proyectiles
    const index = projectiles.indexOf(projectile);
    if (index !== -1) {
      projectiles.splice(index, 1);
    }
  }
  
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
        return true;
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
          // Manejar la colisión de la bala con el bloque aquí
          // Por ejemplo, eliminar la bala
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