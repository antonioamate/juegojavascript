onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const backgroundImage = new Image();
  backgroundImage.src = "./img/forest.jpg";

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  const player = new Player({ position: { x: 50, y: 50 }, ctx });

  function animation() {
    //limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  backgroundImage.onload = () => {
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
    this.acceleration = 6;
    this.speed = {
      x: 0,
      y: 0,
    };
    this.size = {
      width: 200,
      height: 250,
    };
    this.jumpStrength = 25;
    this.gravity = 1;
    this.animation = 2;
    this.frame = 0;
    this.slowFrame = 0;
    this.covered = false;
    this.onGround = false;
    this.facingRight = true;
  }
  draw() {
    this.ctx.fillStyle = "rgba(255, 0, 0,.5)";
    this.ctx.fillRect(this.position.x, this.position.y, 200, 250);
    this.ctx.drawImage(
      this.image,
      this.frame * 200, //por donde empieza a recortar la imagen
      this.animation * 250,
      200, //lo que recorta de la imagen fuente
      250,
      this.position.x,
      this.position.y,
      200,
      250
    );
  }

  update() {
    this.nextFrame();
    this.speed.x = 0;
    this.animation = 2;

    if (this.facingRight) {
      this.idleRight();
    } else {
      this.idleLeft();
    }
    if (this.keys.a) {
      this.speed.x -= this.acceleration;
      this.walkLeft();
      this.facingRight = false;
    }
    if (this.keys.d) {
      this.speed.x += this.acceleration;
      this.walkRight();
      this.facingRight = true;
    }
    if (this.keys.s) {
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
      } else if(this.animation==5) {
        this.animation = 2;
      }
      
      this.jump();
    }

    //actualizar posición
    this.speed.y += this.gravity;
    if (this.position.y + this.speed.y > 470) {
      this.position.y = 470;
      this.speed.y = 0;
      this.onGround = true;
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
