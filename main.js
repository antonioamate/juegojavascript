onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const backgroundImage = new Image();
  backgroundImage.src = "./img/forest.jpg";

  backgroundImage.onload = () => {
    const player = new Player({ position: { x: 50, y: 50 }, ctx });

    function animation() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      player.update();

      player.draw();
    }

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
    canvas.addEventListener("mousemove", function (event) {
      player.aim.x = event.clientX - canvas.getBoundingClientRect().left;
      player.aim.y = event.clientY - canvas.getBoundingClientRect().top;
    });

    canvas.style.cursor = "url('./img/aim_red.cur'), auto";

    function animate() {
      animation();
      requestAnimationFrame(animate);
    }

    animate();
  };
};

class Player {
  constructor({ position, ctx }) {
    this.position = position;
    this.ctx = ctx;
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
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
    this.acceleration = 3;
    this.jumpStrength = 12;
    this.gravity = 0.3;
    this.animation = 2;
    this.frame = 0;
    this.slowFrame = 0;
    this.covered = false;
    this.onGround = false;
    this.facingRight = true;
    this.aim = {
      x: 170,
      y: 600,
    };
    this.arm = {
      deg: 0,
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

    //dibujar el brazo
    this.ctx.lineWidth = this.arm.width;
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(this.arm.start.x, this.arm.start.y);
    this.ctx.lineTo(this.arm.end.x, this.arm.end.y);
    this.ctx.stroke();
  }

  update() {
    this.nextFrame();
    this.speed.x = 0;
    this.idleRight();
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
  }
}
