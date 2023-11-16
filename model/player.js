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
    this.acceleration = 4;
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
    ctx.fillStyle = "rgba(255, 0, 0,0.5)";
    ctx.fillRect(this.position.x, this.position.y, 100, 125);
    ctx.drawImage(this.image, this.frame * 100, this.animation * 125, 100, 125, this.position.x, this.position.y, 100, 125);
    //TO-DO get pistol position
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
    if (this.arm.angle) console.log(this.arm.angle * Math.PI);

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
    this.animationIdleRight();

    this.speed.x = 0;
    //comprobar input a ver que hace
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

    //aplicar gravedad
    this.speed.y += gravity;

    comprobarBarrerasInvisibles(this);

    //actualizar posición
    this.position.y += this.speed.y;
    this.position.x += this.speed.x;
  }
  jump() {
    if (this.onGround) {
      this.speed.y -= this.jumpStrength;
      this.onGround = false;
    }
  }
  animationWalkLeft() {
    this.animation = 0;
    this.arm.offset.x = 19;
    this.arm.offset.y = 23;
  }
  animationWalkRight() {
    this.animation = 1;
    this.arm.offset.x = 81;
    this.arm.offset.y = 23;
  }
  animationIdleRight() {
    this.animation = 2;
    this.arm.offset.x = 67;
    this.arm.offset.y = 28;
  }
  animationIdleLeft() {
    this.animation = 3;
    this.arm.offset.x = 60;
    this.arm.offset.y = 28;
  }
  animationCoverLeft() {
    this.animation = 4;
    this.arm.offset.x = 70;
    this.arm.offset.y = 64;
  }
  animationCoverRight() {
    this.animation = 5;
    this.arm.offset.x = 49;
    this.arm.offset.y = 64;
  }
  animationBackLeft() {
    this.animation = 6;
    this.arm.offset.x = 81;
    this.arm.offset.y = 23;
  }
  animationBackRight() {
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
    let dx = this.aim.x - this.arm.start.x;
    let dy = this.aim.y - this.arm.start.y;
    let length = Math.sqrt(dx * dx + dy * dy);

    let normalizedDx = dx / length;
    let normalizedDy = dy / length;

    this.arm.end.x = this.arm.start.x + normalizedDx * this.arm.length;
    this.arm.end.y = this.arm.start.y + normalizedDy * this.arm.length;
    this.arm.angle = Math.atan2(dy, dx);
    console.log(this.arm.angle);
  }
  shoot() {
    const audio = new Audio("./sounds/pistolShotCut.mp3");
    audio.play();
    const projectile = new Projectile({
      position: this.arm.end,
      target: this.aim,
    });
    projectiles.push(projectile);
  }
}
