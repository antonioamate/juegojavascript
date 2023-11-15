function render(player,blocks,enemies,projectiles) {
  //renderizar background
  //renderizar bloques
  //renderizar jugador
  drawBlocks(player,blocks,enemies,projectiles);
  player.draw(player,blocks,enemies,projectiles);
  drawEnemies(player,blocks,enemies,projectiles); //renderizar enemigos
  drawProjectiles(player,blocks,enemies,projectiles); //renderizar balas
}
function addBlock(blocks,block) {
  block.gameManager = this;
  blocks.push(block);
}
function addEnemy(enemies,enemy) {
  // Método para agregar un nuevo enemigo al array de enemigos
  enemies.push(enemy);
}

function removeEnemy(enemies,enemy) {
  // Método para eliminar un enemigo del array de enemigos
  const index = enemies.indexOf(enemy);
  if (index !== -1) {
    enemies.splice(index, 1);
  }
}

function addProjectile(projectiles,projectile) {
  // Método para agregar un nuevo proyectil al array de proyectiles
  projectiles.push(projectile);
}

function removeProjectile(projectiles,projectile) {
  // Método para eliminar un proyectil del array de proyectiles
  const index = projectiles.indexOf(projectile);
  if (index !== -1) {
    projectiles.splice(index, 1);
  }
}

function isColliding(object1, object2) {
  return object1.x < object2.position.x + object2.size.x && object1.x + size.x > object2.position.x && object1.y < object2.position.y + object2.size.y && object1.y + size.y > projectile.position.y;
}
//PLAYER PROJECTILE
function checkPlayerProjectileCollisions(player,projectiles) {
  for (const projectile of projectiles) {
    if (isColliding(projectile, player)) {
      // Manejar la colisión con la bala aquí
      console.log("¡Colisión con bala detectada!");
      // Por ejemplo, reducir la vida del jugador o eliminar la bala
      player.health -= 20;
      removeProjectile(projectile);
    }
  }
}
//PLAYER BLOCK
function checkPlayerBlockCollisions(player,blocks) {
  for (const block of blocks) {
    if (isColliding(player, block)) {
      // Manejar la colisión del jugador con el bloque aquí
      console.log("¡Colisión del jugador con bloque detectada!");
    }
  }
}
//PLAYER ENEMY
function checkPlayerEnemyCollisions(player,enemies) {
  for (const enemy of enemies) {
    if (isColliding(player, enemy)) {
      // Manejar la colisión con el enemigo aquí
      console.log("¡Colisión con enemigo detectada!");
      player.health -= 20;
    }
  }
}

//ENEMY PROJECTILE
function checkEnemyProjectileCollisions(enemies,projectiles) {
  for (const projectile of projectiles) {
    for (const enemy of enemies) {
      if (isColliding(projectile, enemy)) {
        console.log("¡Colisión con enemigo detectada!");
        enemy.health -= 20;
        removeProjectile(projectile);
      }
    }
  }
}
//PROJECTILE BLOCK
function checkBlockProjectileCollisions(blocks,projectiles) {
  for (const projectile of projectiles) {
    for (const block of blocks) {
      if (isColliding(projectile, block)) {
        // Manejar la colisión de la bala con el bloque aquí
        console.log("¡Colisión de bala con bloque detectada!");
        // Por ejemplo, eliminar la bala
        removeProjectile(projectile);
      }
    }
  }
}
//ENEMY BLOCK
function checkBlockEnemyCollisions(blocks, enemies) {
  for (const enemy of enemies) {
    for (const block of blocks) {
      if (isColliding(enemy, block)) {
        console.log("enemigo ha colisionado con bloque");
      }
    }
  }
}
function drawBlocks(blocks) {
  for (const block of blocks) {
    block.draw();
  }
}
function drawProjectiles(projectiles) {
  for (const projectile of projectiles) {
    projectile.draw();
  }
}

function updateProjectiles(projectiles) {
  for (const projectile of projectiles) {
    projectile.update();
  }
}
function drawEnemies(enemies) {
  for (const enemy of enemies) {
    enemy.draw();
  }
}

function updateEnemies(enemies) {
  for (const enemy of enemies) {
    enemy.update();
  }
}
function animation(player,projectiles,blocks,enemies,ctx,backgroundImage) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  //crear bloques

  // Actualizar enemigos
  for (const enemy of enemies) {
    enemy.update();
    enemy.gameManager = this;
  }

  // Actualizar balas

  for (const projectile of projectiles) {
    projectile.update();
    projectile.gameManager = this;
  }
  // Filtra los proyectiles que ya no están en pantalla
  projectiles = projectiles.filter((projectile) => projectile.position.x > 0 && projectile.position.x < canvas.width && projectile.position.y > 0 && projectile.position.y < canvas.height);

  checkBlockProjectileCollisions(blocks,projectiles);
  checkEnemyProjectileCollisions(enemies,projectiles);
  checkPlayerProjectileCollisions(player,projectiles);
  checkPlayerBlockCollisions(player,blocks);
  checkPlayerEnemyCollisions(player,enemies);
  checkPlayerBlockCollisions(player,blocks);
  checkBlockEnemyCollisions(blocks,enemies);

  render();
}
onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const backgroundImage = new Image();
  backgroundImage.src = "./img/forest.jpg";
  var enemies = []; // Array para almacenar instancias de enemigos
  var projectiles = []; // Array para almacenar instancias de proyectiles
  var player = new Player({ position: { x: 50, y: 50 }, ctx: ctx }); // Instancia del jugador
  backgroundImage.onload = () => {
    const blocks = [
      new CollisionBlock({
        position: {
          x: 500,
          y: 300,
        },
        size: {
          x: 100,
          y: 50,
        },
        color: "brown",
        ctx,
      }),
      new CollisionBlock({
        position: {
          x: 600,
          y: 300,
        },
        size: {
          x: 700,
          y: 50,
        },
        color: "brown",
        ctx,
      }),
      new CollisionBlock({
        position: {
          x: 400,
          y: 500,
        },
        size: {
          x: 100,
          y: 50,
        },
        color: "brown",
        ctx,
      }),
      new CollisionBlock({
        position: {
          x: 600,
          y: 500,
        },
        size: {
          x: 100,
          y: 50,
        },
        color: "brown",
        ctx,
      }),
    ];
    

    addEventListener("keydown", (e) => {
      switch (e.key) {
        case "w":
          player.keys.w = true;
          break;
        case "a":
          player.keys.a = true;
          break;
        case "s":
          player.keys.s = true;
          break;
        case "d":
          player.keys.d = true;
          break;
      }
    });

    addEventListener("keyup", (e) => {
      switch (e.key) {
        case "w":
          player.keys.w = false;
          break;
        case "a":
          player.keys.a = false;
          break;
        case "s":
          player.keys.s = false;
          break;
        case "d":
          player.keys.d = false;
          break;
      }
    });
    addEventListener("mousedown", (e) => {
      player.keys.click = true;
    });
    addEventListener("mouseup", (e) => {
      player.keys.click = false;
    });
    canvas.addEventListener("mousemove", function (event) {
      player.aim.x = event.clientX - canvas.getBoundingClientRect().left;
      player.aim.y = event.clientY - canvas.getBoundingClientRect().top;
    });

    canvas.style.cursor = "url('./img/aim_red.cur'), auto";

    let id1 = setInterval(animation(player,projectiles,blocks,enemies,ctx,backgroundImage), 1000 / 60);
  };
};
class Enemy {
  constructor({ position, ctx, player, blocks, projectiles }) {
    (this.player = player), (this.blocks = blocks), (this.projectiles = projectiles);
    (this.ctx = ctx),
      (this.health = 100),
      (this.pistol = {
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
      });
    this.pistol.image.src = "./img/pistol.png";
    this.position = position;

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
    this.gravity = 0.3;
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
    /* this.ctx.fillStyle = "rgba(255, 0, 0,0.5)";
        this.ctx.fillRect(this.position.x, this.position.y, 100, 125); */
    this.ctx.drawImage(
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
    this.ctx.lineWidth = this.arm.width;
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(this.arm.start.x, this.arm.start.y);
    this.ctx.lineTo(this.arm.end.x, this.arm.end.y);
    this.ctx.stroke();
    //dibujar la pistola

    // Guardar el estado actual del contexto
    this.ctx.save();
    if (this.arm.angle) console.log(this.arm.angle * Math.PI);

    this.ctx.translate(this.arm.end.x, this.arm.end.y);
    this.ctx.rotate(this.arm.angle);
    if (this.facingRight) {
      this.ctx.drawImage(
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
      this.ctx.scale(1, -1); // Reflejar horizontalmente
      this.ctx.drawImage(
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
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 0, 2, 2);

    // Restablecer el contexto al estado guardado
    this.ctx.restore();
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

    //actualizar posición
    this.speed.y += this.gravity;
    if (this.position.y + this.speed.y > 414) {
      this.position.y = 414;
      this.speed.y = 0;
      this.onGround = true;
    }
    if (this.position.x + this.speed.x < 0) {
      this.speed.x = 0;
      this.position.x = 0;
    }
    console.log(this.position.x + " " + this.size.width + " " + this.speed.x);
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
}
class Player {
  constructor({ position, ctx, player, blocks, projectiles }) {
    (this.player = player),
      (this.blocks = blocks),
      (this.projectiles = projectiles),
      (this.health = 100),
      (this.pistol = {
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
      });
    this.pistol.image.src = "./img/pistol.png";
    this.position = position;
    (this.image = new Image()), (this.image.src = "./img/spritestick.png");
    this.ctx = ctx;
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
    };
    (this.position = {
      x: 300,
      y: 300,
    }),
      (this.image = new Image()),
      (this.size = {
        width: 80,
        height: 48,
      }),
      (this.frame = 0),
      (this.facingRight = true),
      (this.shooting = false),
      (this.start = {
        x: 0,
        y: 0,
      }),
      (this.end = {
        x: 0,
        y: 0,
      });
    this.image.src = "./img/pistol.png";
    this.speed = {
      x: 0,
      y: 0,
    };
    this.size = {
      x: 100,
      y: 125,
    };
    this.alternate = 0;
    this.acceleration = 3;
    this.jumpStrength = 12;
    this.gravity = 0.3;
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
    /* this.ctx.fillStyle = "rgba(255, 0, 0,0.5)";
        this.ctx.fillRect(this.position.x, this.position.y, 100, 125); */
    this.ctx.drawImage(
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
    this.ctx.lineWidth = this.arm.width;
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(this.arm.start.x, this.arm.start.y);
    this.ctx.lineTo(this.arm.end.x, this.arm.end.y);
    this.ctx.stroke();
    //dibujar la pistola

    // Guardar el estado actual del contexto
    this.ctx.save();
    if (this.arm.angle) console.log(this.arm.angle * Math.PI);

    this.ctx.translate(this.arm.end.x, this.arm.end.y);
    this.ctx.rotate(this.arm.angle);
    if (this.facingRight) {
      this.ctx.drawImage(
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
      this.ctx.scale(1, -1); // Reflejar horizontalmente
      this.ctx.drawImage(
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
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(0, 0, 2, 2);

    // Restablecer el contexto al estado guardado
    this.ctx.restore();
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
    if (this.canShoot && this.keys.click) {
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
    if (this.keys.a) {
      this.speed.x -= this.acceleration;
      if (this.facingRight) {
        this.backLeft();
      } else {
        this.walkLeft();
      }
    }
    if (this.keys.d) {
      this.speed.x += this.acceleration;
      if (this.facingRight) {
        this.walkRight();
      } else {
        this.backRight();
      }
    }
    if (this.keys.s && this.onGround) {
      this.speed.x = 0;
      if (this.facingRight) {
        this.coverRight();
      } else {
        this.coverLeft();
      }
    }
    if (this.keys.w) {
      if (this.animation == 4) {
        this.animation = 3;
      } else if (this.animation == 5) {
        this.animation = 2;
      }

      this.jump();
    }

    //actualizar posición
    this.speed.y += this.gravity;
    if (this.position.y + this.speed.y > 414) {
      this.position.y = 414;
      this.speed.y = 0;
      this.onGround = true;
    }
    if (this.position.x + this.speed.x < 0) {
      this.speed.x = 0;
      this.position.x = 0;
    }
    console.log(this.position.x + " " + this.size.x + " " + this.speed.x);
    if (this.position.x + this.size.x + this.speed.x > 1280) {
      this.speed.x = 0;
      this.position.x = 1280 - this.size.x;
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

    this.projectiles.push(projectile);
  }
}
class CollisionBlock {
  constructor({ position, size, ctx, player, projectiles, enemies }) {
    this.player = player;
    this.projectiles=projectiles;
    this.enemies=enemies;
    this.position = position;
    this.size = size;
    this.ctx = ctx;
  }
  draw() {
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
  }
}
