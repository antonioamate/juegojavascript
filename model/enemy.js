class Enemy {
  constructor({ position }) {
    this.health = 100;
    this.position = position;
    this.size = {
      width: 100,
      height: 125,
    };

    this.image = new Image();
    this.image.src = "./img/spritestick.png";
    this.speed = {
      x: 0,
      y: 0,
    };
    this.acceleration = 0.5;
    this.animation = 2;
    this.frame = 0;
    this.slowFrame = 0;
    this.onGround = true;
  }

  draw() {
    ctx.fillStyle = "rgba(255, 0, 0,0.5)";
    ctx.fillRect(this.position.x, this.position.y, 100, 125);
    ctx.drawImage(
      this.image,
      this.frame * 100, //por donde empieza a recortar la imagen
      this.animation * 125,
      100, //lo que recorta de la imagen fuente
      125,
      this.position.x, //donde pone la imagen
      this.position.y,
      100, //dimensiones de la imagen a dibujar (dejarlo igual)
      125
    );
  }
  update() {
    this.nextFrame();
    this.speed.x = 0;
    //andar hacia el jugador
    if (player.position.x < this.position.x) {
      this.speed.x -= this.acceleration;
      this.animation = 0;
    }
    if (player.position.x > this.position.x) {
      this.speed.x += this.acceleration;
      this.animation = 1;
    }

    //actualizar posición
    this.speed.y += gravity;

    this.position.y += this.speed.y;
    this.position.x += this.speed.x;
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
