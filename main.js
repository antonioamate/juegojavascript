let ctx, canvas, backgroundImage, player, enemies, blocks, id1, keys, gravity, projectiles;
gravity = 0.3;
enemies = [];

keys = {
  w: false,
  a: false,
  s: false,
  d: false,
};
projectiles = [];

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
      player.speed.x = -player.speed.x * 1.001;
      player.speed.y = -player.speed.y * 1.001;
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

function update() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  player.update();
  player.draw();

  for (const block of blocks) {
    block.draw();
  }
  for (const enemy of enemies) {
    if (enemy.health < 0) {
      removeEnemy(enemy);
    } else {
      enemy.update();
      enemy.draw();
    }
  }
  for (const projectile of projectiles) {
    projectile.update();
    projectile.draw();
  }
  // Filtra los proyectiles que ya no están en pantalla
  projectiles = projectiles.filter((projectile) => projectile.position.x > 0 && projectile.position.x < canvas.width && projectile.position.y > 0 && projectile.position.y < canvas.height);
  checkBlockProjectileCollisions();
  checkEnemyProjectileCollisions();
  checkPlayerProjectileCollisions();
  checkPlayerBlockCollisions();
  checkPlayerEnemyCollisions();
  checkPlayerBlockCollisions();
  checkBlockEnemyCollisions();
}
function animation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
}

onload = () => {
  enemies.push(new Enemy({ position: { x: 600, y: 100 } }));
  blocks = [
    new CollisionBlock({
      position: { x: 400, y: 200 },
      size: { width: 50, heigth: 100 },
    }),
     
    // ... más bloques de colisión
    new CollisionBlock({
      position: { x: 300, y: 440 },
      size: { width: 20, height: 100 },
    }),
    // ... más bloques de colisión
  ];
  player = new Player({ position: { x: 50, y: 50 } });
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  backgroundImage = new Image();
  backgroundImage.src = "./img/forest.jpg";

  addEventListener("keydown", (e) => {
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
    }
  });

  addEventListener("keyup", (e) => {
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
  });
  addEventListener("mousedown", (e) => {
    keys.click = true;
  });
  addEventListener("mouseup", (e) => {
    keys.click = false;
  });
  canvas.addEventListener("mousemove", function (event) {
    player.aim.x = event.clientX - canvas.getBoundingClientRect().left;
    player.aim.y = event.clientY - canvas.getBoundingClientRect().top;
  });

  canvas.style.cursor = "url('./img/aim_red.cur'), auto";

  id1 = setInterval(animation, 1000 / 60);
};

class Player {
  constructor({ position }) {
    this.pistol = {
      position: {
        x: 300,
        y: 300,
      },
      image: new Image(),
      size: {
        width: 80,
        height: 48,
      },
      frame: 0,
      facingRight: true,
      shooting: false,
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
    };
    this.pistol.image.src = "./img/pistol.png";
    this.position = position;
    this.image = new Image();
    this.image.src = "./img/spritestick.png";

    this.speed = {
      x: 0,
      y: 0,
    };
    this.size = {
      width: 100,
      height: 125,
    };
    this.alternate = 0;
    this.acceleration = 3;
    this.jumpStrength = 12;
    this.animation = 2;
    this.frame = 0;
    this.slowFrame = 0;
    this.covered = false;
    this.onGround = false;
    this.facingRight = true;
    this.slowFrameShoot = 0;
    this.fireRate = 20;
    this.aim = {
      x: 170,
      y: 600,
    };
    this.arm = {
      length: 48,
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
      width: 3.5,
      offset: {
        x: 0,
        y: 0,
      },
      angle: 0,
    };
  }

  draw() {
    /* ctx.fillStyle = "rgba(255, 0, 0,0.5)";
    ctx.fillRect(this.position.x, this.position.y, 100, 125); */
    ctx.drawImage(
      this.image,
      this.frame * 100, //por donde empieza a recortar la imagen
      this.animation * 125,
      100, //lo que recorta de la imagen fuente
      125,
      this.position.x,
      this.position.y,
      100,
      125
    );
    this.getArmDimensions();

    this.pistol.position = { x: this.arm.end.x, y: this.arm.end.y };

    //dibujar el brazo
    ctx.lineWidth = this.arm.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.arm.start.x, this.arm.start.y);
    ctx.lineTo(this.arm.end.x, this.arm.end.y);
    ctx.stroke();
    //dibujar la pistola

    // Guardar el estado actual del contexto
    ctx.save();

    ctx.translate(this.arm.end.x, this.arm.end.y);
    ctx.rotate(this.arm.angle);
    if (this.facingRight) {
      ctx.drawImage(
        this.pistol.image,
        80 * this.pistol.frame, //inicio x
        0, //inicio y
        80, //cuanto cortar de la imagen
        48, //cuanto cortar
        -80 / 2 + 17, //posición donde situar la pistola
        -48 / 2 + 2,
        80, //dimensiones de la imagen final
        48
      );
    } else {
      ctx.scale(1, -1); // Reflejar horizontalmente
      ctx.drawImage(
        this.pistol.image,
        80 * this.pistol.frame, //inicio x
        0, //inicio y
        80, //cuanto cortar de la imagen
        48, //cuanto cortar
        -80 / 2 + 17, //posición donde situar la pistola
        -48 / 2 + 2,
        80, //dimensiones de la imagen final
        48
      );
    }

    // Restablecer el contexto al estado guardado
    ctx.restore();
  }
  nextFramePistol() {
    if (this.alternate > 0) {
      if (this.pistol.shooting) {
        if (this.pistol.frame > 9) {
          this.pistol.frame = 0;
          this.pistol.shooting = false;
        } else {
          this.pistol.frame++;
        }
      }
      this.alternate = 0;
    } else {
      this.alternate++;
    }
  }
  update() {
    this.nextFrame();
    this.nextFrameShoot();
    this.nextFramePistol();
    this.idleRight();
    console.log(this.speed);
    this.speed.x = 0;
    if (this.canShoot && keys.click) {
      this.shoot();
      this.canShoot = false;
      this.slowFrameShoot = 0;
      this.pistol.shooting = true;
    }
    if (this.aim.x < this.position.x + 60) {
      this.facingRight = false;
    } else {
      this.facingRight = true;
    }
    if (this.facingRight) {
      this.idleRight();
    } else {
      this.idleLeft();
    }
    if (keys.a) {
      this.speed.x -= this.acceleration;
      if (this.facingRight) {
        this.backLeft();
      } else {
        this.walkLeft();
      }
    }
    if (keys.d) {
      this.speed.x += this.acceleration;
      if (this.facingRight) {
        this.walkRight();
      } else {
        this.backRight();
      }
    }
    if (keys.s && this.onGround) {
      this.speed.x = 0;
      if (this.facingRight) {
        this.coverRight();
      } else {
        this.coverLeft();
      }
    }
    if (keys.w) {
      if (this.animation == 4) {
        this.animation = 3;
      } else if (this.animation == 5) {
        this.animation = 2;
      }

      this.jump();
    }

    //actualizar posición
    this.speed.y += gravity;
    if (this.position.y + this.speed.y > 414) {
      this.position.y = 414;
      this.speed.y = 0;
      this.onGround = true;
    }
    if (this.position.x + this.speed.x < 0) {
      this.speed.x = 0;
      this.position.x = 0;
    }
    if (this.position.x + this.size.width + this.speed.x > 1280) {
      this.speed.x = 0;
      this.position.x = 1280 - this.size.width;
    }
    this.position.y += this.speed.y;
    this.position.x += this.speed.x;
  }
  jump() {
    if (this.onGround) {
      this.speed.y -= this.jumpStrength;
      this.onGround = false;
    }
  }
  walkLeft() {
    this.animation = 0;
    this.arm.offset.x = 19;
    this.arm.offset.y = 23;
  }
  walkRight() {
    this.animation = 1;
    this.arm.offset.x = 81;
    this.arm.offset.y = 23;
  }
  idleRight() {
    this.animation = 2;
    this.arm.offset.x = 67;
    this.arm.offset.y = 28;
  }
  idleLeft() {
    this.animation = 3;
    this.arm.offset.x = 60;
    this.arm.offset.y = 28;
  }
  coverLeft() {
    this.animation = 4;
    this.arm.offset.x = 70;
    this.arm.offset.y = 64;
  }
  coverRight() {
    this.animation = 5;
    this.arm.offset.x = 49;
    this.arm.offset.y = 64;
  }
  backLeft() {
    this.animation = 6;
    this.arm.offset.x = 81;
    this.arm.offset.y = 23;
  }
  backRight() {
    this.animation = 7;
    this.arm.offset.x = 19;
    this.arm.offset.y = 23;
  }
  nextFrame() {
    if (this.slowFrame > 8) {
      if (this.frame < 7) {
        this.frame++;
      } else {
        this.frame = 0;
      }
      this.slowFrame = 0;
    } else {
      this.slowFrame++;
    }
  }
  nextFrameShoot() {
    if (this.slowFrameShoot > this.fireRate) {
      this.canShoot = true;
      this.slowFrameShoot = 0;
    } else {
      this.slowFrameShoot++;
    }
  }

  getArmDimensions() {
    //calcula el inicio y el fin del brazo a partir del offset, el frame,
    //las coordenadas del ratón, y la posición del jugador
    //calcular inicio brazo
    if (this.frame < 5) {
      this.arm.start.y = this.position.y + this.arm.offset.y + this.frame - 0.5;
    } else {
      this.arm.start.y = this.position.y + this.arm.offset.y + 7 - this.frame - 0.5;
    }
    this.arm.start.x = this.position.x + this.arm.offset.x;
    //calcular final brazo
    let startX = this.arm.start.x;
    let endX = this.aim.x;
    let startY = this.arm.start.y;
    let endY = this.aim.y;
    let dx = endX - startX;
    let dy = endY - startY;
    let length = Math.sqrt(dx * dx + dy * dy);

    let normalizedDx = dx / length;
    let normalizedDy = dy / length;

    this.arm.end.x = startX + normalizedDx * this.arm.length;
    this.arm.end.y = startY + normalizedDy * this.arm.length;
    this.arm.angle = Math.atan2(dy, dx);
  }
  shoot() {
    const audio = new Audio("./sounds/pistolShotCut.mp3");
    audio.play();
    const projectile = new Projectile({
      startX: this.arm.end.x,
      startY: this.arm.end.y,
      targetX: this.aim.x,
      targetY: this.aim.y,
    });

    projectiles.push(projectile);
  }

  drawProjectiles() {
    for (const projectile of projectiles) {
      projectile.draw();
    }
  }

  updateProjectiles() {
    for (const projectile of projectiles) {
      projectile.update();
    }
    // Filtra los proyectiles que ya no están en pantalla
    projectiles = projectiles.filter((projectile) => projectile.position.x > 0 && projectile.position.x < canvas.width && projectile.position.y > 0 && projectile.position.y < canvas.height);
  }
}
class Projectile {
  constructor({ startX, startY, targetX, targetY }) {
    this.position = { x: startX, y: startY };
    this.target = { x: targetX, y: targetY };
    this.speed = 20;
    this.size = {
      width: 10,
      height: 2,
    };
    this.angle = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.save();
    ctx.translate(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
    ctx.rotate(this.angle);
    console.log(this.angle);

    ctx.fillRect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
    ctx.restore();
  }

  update() {
    this.position.x += this.speed * Math.cos(this.angle);
    this.position.y += this.speed * Math.sin(this.angle);
  }
}
class Enemy {
  constructor({ position }) {
    this.health = 100;
    this.pistol = {
      position: {
        x: 710,
        y: 300,
      },
      image: new Image(),
      size: {
        width: 80,
        height: 48,
      },
      frame: 0,
      facingRight: true,
      shooting: false,
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
    };
    this.pistol.image.src = "./img/pistol.png";
    this.position = position;
    this.image = new Image();
    this.image.src = "./img/spritestick.png";

    this.speed = {
      x: 0,
      y: 0,
    };
    this.size = {
      width: 100,
      height: 125,
    };
    this.alternate = 0;
    this.acceleration = 3;
    this.jumpStrength = 12;
    this.animation = 2;
    this.frame = 0;
    this.slowFrame = 0;
    this.covered = false;
    this.onGround = false;
    this.facingRight = true;
    this.slowFrameShoot = 0;
    this.fireRate = 20;
    this.aim = {
      x: 170,
      y: 600,
    };
    this.arm = {
      length: 48,
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
      width: 3.5,
      offset: {
        x: 0,
        y: 0,
      },
      angle: 0,
    };
  }

  draw() {
    /* ctx.fillStyle = "rgba(255, 0, 0,0.5)";
    ctx.fillRect(this.position.x, this.position.y, 100, 125); */
    ctx.drawImage(
      this.image,
      this.frame * 100, //por donde empieza a recortar la imagen
      this.animation * 125,
      100, //lo que recorta de la imagen fuente
      125,
      this.position.x,
      this.position.y,
      100,
      125
    );
    this.getArmDimensions();

    this.pistol.position = { x: this.arm.end.x, y: this.arm.end.y };

    //dibujar el brazo
    ctx.lineWidth = this.arm.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.arm.start.x, this.arm.start.y);
    ctx.lineTo(this.arm.end.x, this.arm.end.y);
    ctx.stroke();
    //dibujar la pistola

    // Guardar el estado actual del contexto
    ctx.save();
    let flip;

    ctx.translate(this.arm.end.x, this.arm.end.y);
    ctx.rotate(this.arm.angle);
    if (this.facingRight) {
      ctx.drawImage(
        this.pistol.image,
        80 * this.pistol.frame, //inicio x
        0, //inicio y
        80, //cuanto cortar de la imagen
        48, //cuanto cortar
        -80 / 2 + 17, //posición donde situar la pistola
        -48 / 2 + 2,
        80, //dimensiones de la imagen final
        48
      );
    } else {
      ctx.scale(1, -1); // Reflejar horizontalmente
      ctx.drawImage(
        this.pistol.image,
        80 * this.pistol.frame, //inicio x
        0, //inicio y
        80, //cuanto cortar de la imagen
        48, //cuanto cortar
        -80 / 2 + 17, //posición donde situar la pistola
        -48 / 2 + 2,
        80, //dimensiones de la imagen final
        48
      );
    }
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, 2, 2);

    // Restablecer el contexto al estado guardado
    ctx.restore();
  }
  nextFramePistol() {
    if (this.alternate > 0) {
      if (this.pistol.shooting) {
        if (this.pistol.frame > 9) {
          this.pistol.frame = 0;
          this.pistol.shooting = false;
        } else {
          this.pistol.frame++;
        }
      }
      this.alternate = 0;
    } else {
      this.alternate++;
    }
  }
  update() {
    this.nextFrame();
    this.nextFrameShoot();
    this.nextFramePistol();
    this.idleRight();
    this.speed.x = 0;
    if (this.canShoot && Math.abs(this.position.x - player.position.x) > 200) {
      this.shoot();
      this.canShoot = false;
      this.slowFrameShoot = 0;
      this.pistol.shooting = true;
    }
    if (this.aim.x < this.position.x + 60) {
      this.facingRight = false;
    } else {
      this.facingRight = true;
    }
    if (this.facingRight) {
      this.idleRight();
    } else {
      this.idleLeft();
    }
    if (Math.abs(this.position.x - player.position.x) > 200) {
      this.speed.x -= this.acceleration;
      if (this.facingRight) {
        this.backLeft();
      } else {
        this.walkLeft();
      }
    }
    if (this.position.x < player.position.x + 100) {
      this.speed.x += this.acceleration;
      if (this.facingRight) {
        this.walkRight();
      } else {
        this.backRight();
      }
    }
    if (keys.s && this.onGround) {
      this.speed.x = 0;
      if (this.facingRight) {
        this.coverRight();
      } else {
        this.coverLeft();
      }
    }

    //actualizar posición
    this.speed.y += gravity;
    if (this.position.y + this.speed.y > 414) {
      this.position.y = 414;
      this.speed.y = 0;
      this.onGround = true;
    }
    if (this.position.x + this.speed.x < 0) {
      this.speed.x = 0;
      this.position.x = 0;
    }
    if (this.position.x + this.size.width + this.speed.x > 1200) {
      this.speed.x = 0;
      this.position.x = 1200 - this.size.x;
    }
    this.position.y += this.speed.y;
    this.position.x += this.speed.x;
  }
  jump() {
    if (this.onGround) {
      this.speed.y -= this.jumpStrength;
      this.onGround = false;
    }
  }
  walkLeft() {
    this.animation = 0;
    this.arm.offset.x = 19;
    this.arm.offset.y = 23;
  }
  walkRight() {
    this.animation = 1;
    this.arm.offset.x = 81;
    this.arm.offset.y = 23;
  }
  idleRight() {
    this.animation = 2;
    this.arm.offset.x = 67;
    this.arm.offset.y = 28;
  }
  idleLeft() {
    this.animation = 3;
    this.arm.offset.x = 60;
    this.arm.offset.y = 28;
  }
  coverLeft() {
    this.animation = 4;
    this.arm.offset.x = 70;
    this.arm.offset.y = 64;
  }
  coverRight() {
    this.animation = 5;
    this.arm.offset.x = 49;
    this.arm.offset.y = 64;
  }
  backLeft() {
    this.animation = 6;
    this.arm.offset.x = 81;
    this.arm.offset.y = 23;
  }
  backRight() {
    this.animation = 7;
    this.arm.offset.x = 19;
    this.arm.offset.y = 23;
  }
  nextFrame() {
    if (this.slowFrame > 8) {
      if (this.frame < 7) {
        this.frame++;
      } else {
        this.frame = 0;
      }
      this.slowFrame = 0;
    } else {
      this.slowFrame++;
    }
  }
  nextFrameShoot() {
    if (this.slowFrameShoot > this.fireRate) {
      this.canShoot = true;
      this.slowFrameShoot = 0;
    } else {
      this.slowFrameShoot++;
    }
  }

  getArmDimensions() {
    //calcula el inicio y el fin del brazo a partir del offset, el frame,
    //las coordenadas del ratón, y la posición del jugador
    //calcular inicio brazo
    if (this.frame < 5) {
      this.arm.start.y = this.position.y + this.arm.offset.y + this.frame - 0.5;
    } else {
      this.arm.start.y = this.position.y + this.arm.offset.y + 7 - this.frame - 0.5;
    }
    this.arm.start.x = this.position.x + this.arm.offset.x;
    //calcular final brazo
    let startX = this.arm.start.x;
    let endX = this.aim.x;
    let startY = this.arm.start.y;
    let endY = this.aim.y;
    let dx = endX - startX;
    let dy = endY - startY;
    let length = Math.sqrt(dx * dx + dy * dy);

    let normalizedDx = dx / length;
    let normalizedDy = dy / length;

    this.arm.end.x = startX + normalizedDx * this.arm.length;
    this.arm.end.y = startY + normalizedDy * this.arm.length;
    this.arm.angle = Math.atan2(dy, dx);
  }
  shoot() {
    const audio = new Audio("./sounds/pistolShotCut.mp3");
    audio.play();
    const projectile = new Projectile({
      startX: this.arm.end.x,
      startY: this.arm.end.y,
      targetX: this.aim.x,
      targetY: this.aim.y,
    });

    projectiles.push(projectile);
  }

  drawProjectiles() {
    for (const projectile of projectiles) {
      projectile.draw();
    }
  }

  updateProjectiles() {
    for (const projectile of projectiles) {
      projectile.update();
    }
    // Filtra los proyectiles que ya no están en pantalla
    projectiles = projectiles.filter((projectile) => projectile.position.x > 0 && projectile.position.x < canvas.width && projectile.position.y > 0 && projectile.position.y < canvas.height);
  }
}
class CollisionBlock {
  constructor({ position, size }) {
    this.size = {
      width: size.width,
      height: size.height,
    };
    this.position = {
      x: position.x,
      y: position.y,
    };
  }

  draw() {
    ctx.fillStyle = "brown"; // Color de los bloques de colisión
    ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
  }
}
