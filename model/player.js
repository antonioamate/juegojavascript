class Player {
  constructor({ position }) {
    this.hitbox = {
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 0,
        height: 0,
      },
    };
    this.health = 100;
    this.dead = false;
    this.deathTime = 0;
    this.pistol = {
      canShoot: true,
      angle: 0,
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
      lastShotTime: 0,
      shotCoolDown: 20,
      shoulderDistance: 45,
      aimDistance: 0,
    };
    this.uzi = {
      canShoot: true,
      angle: 0,
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
      lastShotTime: 0,
      shotCoolDown: 5,
      shoulderDistance: 45,
      aimDistance: 0,
    };
    this.pistol.image.src = "./img/pistol.png";
    this.uzi.image.src = "./img/uzi.png";
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
    this.acceleration = 4;
    this.jumpStrength = 12;
    this.animation = 2;
    this.covered = false;
    this.onGround = false;
    this.facingRight = true;

    this.aim = {
      x: 1000,
      y: 400,
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
  drawPlayer() {
    ctx.fillStyle = "rgba(255, 0, 0,0.2)";
    ctx.fillRect(this.position.x, this.position.y, 100, 125);
    ctx.fillStyle = "rgba(0, 255, 0,0.5)";
    ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.width, this.hitbox.size.height);
    ctx.drawImage(this.image, this.frame * 100, this.animation * 125, 100, 125, this.position.x, this.position.y, 100, 125);
  }
  drawArm() {
    //dibujar el brazo
    ctx.lineWidth = this.arm.width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(this.arm.start.x, this.arm.start.y);
    ctx.lineTo(this.arm.end.x, this.arm.end.y);
    ctx.stroke();
  }
  drawPistol() {
    //dibujar la pistola
    ctx.save();
    ctx.translate(this.pistol.position.x, this.pistol.position.y);
    ctx.rotate(this.pistol.angle);
    if (!this.facingRight) ctx.scale(1, -1); // Reflejar horizontalmente
    ctx.drawImage(
      this.pistol.image,
      80 * this.pistol.frame, //inicio x
      0, //inicio y
      80, //cuanto cortar de la imagen
      48,
      -80 / 2 + 11, //posición donde situar la pistola
      -48 / 2 + 11,
      80, //dimensiones de la imagen final
      48
    );
    // Restablecer el contexto al estado guardado
    ctx.restore();
  }
  getArmPistolDimensions() {
    //calcula la posición del hombro y la posición de la culata a partir del offset, el frame,
    //las coordenadas del ratón, y la posición del jugador
    //calcular hombro
    if (this.frame < 5) {
      this.arm.start.y = this.position.y + this.arm.offset.y + this.frame - 0.5;
    } else {
      this.arm.start.y = this.position.y + this.arm.offset.y + 7 - this.frame - 0.5;
    }
    this.arm.start.x = this.position.x + this.arm.offset.x;

    //calcular posicion pistola
    let armRotation;
    let dx = this.aim.x - this.arm.start.x;
    let dy = this.aim.y - this.arm.start.y;
    this.pistol.aimDistance = Math.sqrt(dx * dx + dy * dy);

    let normalizedDx = dx / this.pistol.aimDistance;
    let normalizedDy = dy / this.pistol.aimDistance;

    this.pistol.position.x = this.arm.start.x + normalizedDx * this.pistol.shoulderDistance;
    this.pistol.position.y = this.arm.start.y + normalizedDy * this.pistol.shoulderDistance;
    this.pistol.angle = Math.atan2(dy, dx);

    //ajustar el brazo segun donde mire el jugador

    armRotation = this.facingRight ? 0.16 : -0.16;

    let armDX = normalizedDx * Math.cos(armRotation) - normalizedDy * Math.sin(armRotation);
    let armDY = normalizedDx * Math.sin(armRotation) + normalizedDy * Math.cos(armRotation);

    this.arm.end.x = this.arm.start.x + armDX * this.arm.length;
    this.arm.end.y = this.arm.start.y + armDY * this.arm.length;
  }
  shoot() {
    this.pistol.canShoot = false;
    this.pistol.shooting = true;
    this.pistol.lastShotTime = frame;
    const audio = new Audio("./sounds/pistolShotCut.mp3");
    audio.play();
    let angle = this.pistol.angle;
    const projectile = new Projectile({
      position: {
        x: this.pistol.position.x,
        y: this.pistol.position.y,
      },
      target: {
        x: this.aim.x,
        y: this.aim.y,
      },
      angle: angle,
    });
    projectiles.push(projectile);
  }
  nextFramePistol() {
    if (this.pistol.shooting) {
      if (this.pistol.frame > 9) {
        //si ha terminado de disparar se para la animación
        this.pistol.frame = 0;
        this.pistol.shooting = false;
      } else {
        this.pistol.frame++;
      }
    }
  }
  updateCanShoot() {
    if (frame - this.pistol.lastShotTime > this.pistol.shotCoolDown) {
      this.pistol.canShoot = true;
    }
  }
  update() {
    this.speed.x = 0;
    //en el momento en el que lo matan estaba vivo y es la primera vez que se muere
    //si está muerto no se puede morir más y se guarda la hora de la defunción
    //el frame se pone a 0
    if (!this.dead && this.health <= 0) {
      this.animation = 8;
      this.dead = true;
      this.deathTime = frame;
      this.frame = 0;
      const audio = new Audio("./sounds/wasted.mp3");
      audio.play();
    } else if (this.dead) {
      this.nextFrameDead();
      if (frame - this.deathTime > 600) {
        //aquí se tiene que acabar el juego
        
        newGame();
      }
    } else {
      this.animationIdleRight();
      this.updateCanShoot();
      this.nextFramePistol();
      this.nextAnimationFrame();
      this.checkInput();

      //aplicar gravedad
      this.speed.y += gravity;

      comprobarBarrerasInvisibles(this);

      //actualizar posición
      this.position.y += this.speed.y;
      this.position.x += this.speed.x;
      //a partir de la posición del jugador obtengo
      this.getArmPistolDimensions();
    }
  }

  jump() {
    if (this.onGround) {
      this.speed.y -= this.jumpStrength;
      this.onGround = false;
    }
  }
  nextFrameDead() {
    if (frame % 8 === 0) {
      if (this.frame >= 7) {
        this.frame = 7;
      } else {
        this.frame++;
      }
    }
  }
  nextAnimationFrame() {
    if (frame % 8 === 0) {
      if (this.frame < 7) {
        this.frame++;
      } else {
        this.frame = 0;
      }
    }
  }

  draw() {
    this.drawPlayer();
    if (!this.dead) {
      this.drawArm();
      this.drawPistol();
    }
  }
  checkInput() {
    //&& keys.click

    if (this.pistol.canShoot && keys.click) {
      this.shoot();
    }
    if (this.aim.x < this.position.x + 60) {
      this.facingRight = false;
    } else {
      this.facingRight = true;
    }
    if (this.facingRight) {
      this.animationIdleRight();
    } else {
      this.animationIdleLeft();
    }
    if (keys.a) {
      this.speed.x -= this.acceleration;
      if (this.facingRight) {
        this.animationBackLeft();
      } else {
        this.animationWalkLeft();
      }
    }
    if (keys.d) {
      this.speed.x += this.acceleration;
      if (this.facingRight) {
        this.animationWalkRight();
      } else {
        this.animationBackRight();
      }
    }
    if (keys.s && this.onGround) {
      this.speed.x = 0;
      if (this.facingRight) {
        this.animationCoverRight();
      } else {
        this.animationCoverLeft();
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
  }
  animationWalkLeft() {
    this.animation = 0;
    this.arm.offset.x = 19;
    this.arm.offset.y = 23;
    this.hitbox.position.x = this.position.x;
    this.hitbox.position.y = this.position.y;
    this.hitbox.size.width = this.size.width - 50;
    this.hitbox.size.height = this.size.height;
  }
  animationWalkRight() {
    this.animation = 1;
    this.arm.offset.x = 81;
    this.arm.offset.y = 23;
    this.hitbox.position.x = this.position.x + 50;
    this.hitbox.position.y = this.position.y;
    this.hitbox.size.width = this.size.width - 50;
    this.hitbox.size.height = this.size.height;
  }
  animationIdleRight() {
    this.animation = 2;
    this.arm.offset.x = 67;
    this.arm.offset.y = 28;
    this.hitbox.position.x = this.position.x + 50;
    this.hitbox.position.y = this.position.y;
    this.hitbox.size.width = this.size.width - 70;
    this.hitbox.size.height = this.size.height;
  }
  animationIdleLeft() {
    this.animation = 3;
    this.arm.offset.x = 60;
    this.arm.offset.y = 28;
    this.hitbox.position.x = this.position.x + 49;
    this.hitbox.position.y = this.position.y;
    this.hitbox.size.width = this.size.width - 72;
    this.hitbox.size.height = this.size.height;
  }
  animationCoverLeft() {
    this.animation = 4;
    this.arm.offset.x = 70;
    this.arm.offset.y = 64;
    this.hitbox.position.x = this.position.x + 42;
    this.hitbox.position.y = this.position.y + 39;
    this.hitbox.size.width = this.size.width - 42;
    this.hitbox.size.height = this.size.height - 39;
  }
  animationCoverRight() {
    this.animation = 5;
    this.arm.offset.x = 49;
    this.arm.offset.y = 64;
    this.hitbox.position.x = this.position.x + 19;
    this.hitbox.position.y = this.position.y + 38;
    this.hitbox.size.width = this.size.width - 42;
    this.hitbox.size.height = this.size.height - 40;
  }
  animationBackLeft() {
    this.animation = 6;
    this.arm.offset.x = 81;
    this.arm.offset.y = 23;
    this.hitbox.position.x = this.position.x + 50;
    this.hitbox.position.y = this.position.y;
    this.hitbox.size.width = this.size.width - 50;
    this.hitbox.size.height = this.size.height;
  }
  animationBackRight() {
    this.animation = 7;
    this.arm.offset.x = 19;
    this.arm.offset.y = 23;
    this.hitbox.position.x = this.position.x;
    this.hitbox.position.y = this.position.y;
    this.hitbox.size.width = this.size.width - 50;
    this.hitbox.size.height = this.size.height;
  }
}
