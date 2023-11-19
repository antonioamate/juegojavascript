class Player {
  constructor() {
    this.hitboxOffset = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    this.lastHitboxOffset = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    this.lastPosition = {
      x: 0,
      y: 0,
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
    this.position = {
      x: Math.random() * 1260 + 10,
      y: 50,
    };
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

  update() {
    this.speed.x = 0;
    this.lastHitboxOffset={
      x: this.hitboxOffset.x,
      y: this.hitboxOffset.y,
      width: this.hitboxOffset.width,
      height: this.hitboxOffset.height
    }
    this.lastPosition= {
      x: this.position.y,
      y: this.position.y
    }
    //en el momento en el que lo matan estaba vivo y es la primera vez que se muere
    //si está muerto no se puede morir más y se guarda la hora de la defunción
    //el frame se pone a 0
    if (!this.dead && this.health <= 0) {
      this.animation = 8;
      this.dead = true;
      this.deathTime = frame;
      this.frame = 0;
      randomSound(playerDeathSounds);
    } else if (this.dead) {
      this.nextFrameDead();
      if (frame - this.deathTime > 140) {
        paused = true;
      }
      if (frame - this.deathTime > 600) {
        //aquí se tiene que acabar el juego
      }
    } else {
      this.updateCanShoot();
      this.nextFramePistol();
      this.nextAnimationFrame();

      this.checkInput();

      //aplicar gravedad
      this.speed.y += gravity;

      //actualizar posición
      this.position.y += this.speed.y;
      this.position.x += this.speed.x;

      checkPlayerCollisions();

      this.getArmPistolDimensions();
    }
  }

  checkInput() {
    if (this.pistol.canShoot && keys.click) this.shoot();
    this.facingRight = this.aim.x < this.position.x + 60 ? false : true;
    this.facingRight ? this.animationIdleRight() : this.animationIdleLeft();
    if (keys.a) {
      this.speed.x -= this.acceleration;
      this.facingRight ? this.animationBackLeft() : this.animationWalkRight();
    }
    if (keys.d) {
      this.speed.x += this.acceleration;
      this.facingRight ? this.animationWalkRight() : this.animationBackRight();
    }
    if (keys.s && this.onGround) {
      this.speed.x = 0;
      this.facingRight ? this.animationCoverRight() : this.animationCoverLeft();
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
    if (frame - this.pistol.lastShotTime > this.pistol.shotCoolDown) this.pistol.canShoot = true;
  }
  draw() {
    this.drawPlayer();
    if (!this.dead) {
      this.drawArm();
      this.drawPistol();
    }
  }

  updateHitBoxOffset(offset = { x, y, width, height }) {
    this.hitboxOffset.x = offset.x ?? 0;
    this.hitboxOffset.y = offset.y ?? 0;
    this.hitboxOffset.width = offset.width ?? 0;
    this.hitboxOffset.height = offset.height ?? 0;
  }
  
  animationWalkLeft() {
    this.animation = 0;
    this.updateArmOffset({ x: 19, y: 23 });
    this.updateHitBoxOffset({ width: -50 });
  }
  animationWalkRight() {
    this.animation = 1;
    this.updateArmOffset({ x: 81, y: 23 });
    this.updateHitBoxOffset({ x: 50, width: -50 });
  }
  animationIdleRight() {
    this.animation = 2;
    this.updateArmOffset({ x: 67, y: 28 });
    this.updateHitBoxOffset({ x: 50, width: -70 });
  }
  animationIdleLeft() {
    this.animation = 3;
    this.updateArmOffset({ x: 60, y: 28 });
    this.updateHitBoxOffset({ x: 49, width: -72 });
  }
  animationCoverLeft() {
    this.animation = 4;
    this.updateArmOffset({ x: 70, y: 64 });
    this.updateHitBoxOffset({ x: 42, y: 39, width: -42, height: -39 });
  }
  animationCoverRight() {
    this.animation = 5;
    this.updateArmOffset({ x: 49, y: 64 });
    this.updateHitBoxOffset({ x: 19, y: 38, width: -42, height: -40 });
  }
  animationBackLeft() {
    this.animation = 6;
    this.updateArmOffset({ x: 81, y: 23 });
    this.updateHitBoxOffset({ x: 50, width: -50 });
  }
  animationBackRight() {
    this.animation = 7;
    this.updateArmOffset({ x: 19, y: 23 });
    this.updateHitBoxOffset({ width: -50 });
  }
  updateArmOffset(offset = { x, y }) {
    this.arm.offset.x = offset.x;
    this.arm.offset.y = offset.y;
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
  jump() {
    if (this.onGround) {
      this.speed.y -= this.jumpStrength;
      randomSound(jumpSounds);
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
  drawPlayer() {
    ctx.fillStyle = "rgba(255, 0, 0,0.2)";
    ctx.fillRect(this.position.x, this.position.y, 100, 125);
    ctx.fillStyle = "rgba(0, 255, 0,0.5)";
    ctx.fillRect(this.position.x + this.hitboxOffset.x, this.position.y + this.hitboxOffset.y, this.size.width + this.hitboxOffset.width, this.size.height);
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
}
