onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const backgroundImage = new Image();
  backgroundImage.src = "./img/forest.jpg";

  backgroundImage.onload = () => {
    // Draw the background image when it's loaded

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

      // Hacer algo con las coordenadas (por ejemplo, mostrarlas en la consola)
      console.log("Coordenadas del cursor: x=" + player.aim.x + ", y=" + player.aim.y);
    });

    canvas.style.cursor = "url('./img/aim_red.cur'), auto";

    function animate() {
      animation();
      requestAnimationFrame(animate);
    }

    // Start the animation loop
    animate();
  };
};

// The rest of your Player class remains unchanged

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
      x: 300,
      y: 300,
    };
  }
  draw() {
    /* this.ctx.fillStyle = "rgba(255, 0, 0,.5)";
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
  }

  update() {
    this.nextFrame();
    this.speed.x = 0;
    this.animation = 2;
    if(this.aim.x<this.position.x+60){
      this.facingRight=false
    }else{
      this.facingRight=true
    }
    if (this.facingRight) {
      this.idleRight();
    } else {
      this.idleLeft();
    }
    if (this.keys.a) {
      this.speed.x -= this.acceleration;
      if(this.facingRight){
        this.backLeft()
      }else{
        this.walkLeft();
      }
    }
    if (this.keys.d) {
      this.speed.x += this.acceleration;
      if(this.facingRight){
        this.walkRight();
      }else{
        this.backRight()
      }
    }
    if (this.keys.s) {
      if (this.onGround) {
        this.speed.x = 0;
        if (this.facingRight) {
          this.coverRight();
        } else {
          this.coverLeft();
        }
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
    if (this.position.x + this.speed.x < 0) {
      this.speed.x = 0;
      this.position.x = 0;
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
    if (this.animation !== 0) {
      this.animation = 0;
    }
  }
  walkRight() {
    if (this.animation !== 1) {
      this.animation = 1;
    }
  }
  idleRight() {
    if (this.animation !== 2) {
      this.animation = 2;
    }
  }
  idleLeft() {
    if (this.animation !== 3) {
      this.animation = 3;
    }
  }
  coverLeft() {
    if (this.animation !== 4) {
      this.animation = 4;
    }
  }
  coverRight() {
    if (this.animation !== 5) {
      this.animation = 5;
    }
  }
  backLeft() {
    if (this.animation !== 6) {
      this.animation = 6;
    }
  }
  backRight() {
    if (this.animation !== 7) {
      this.animation = 7;
    }
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
}
