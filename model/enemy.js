class Enemy {
  constructor() {
    this.lastBite = 0;
    this.hitboxOffset = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    this.health = 100;
    this.dead = false;
    this.deathTime = 0;
    this.position = {
      x: Math.random() * 1270,
      y: 100,
    };
    this.size = {
      width: 100,
      height: 125,
    };

    this.image = new Image();
    this.image.src = "./img/spriteenemy.png";
    this.speed = {
      x: 0,
      y: 0,
    };
    this.acceleration = 0.5;
    this.animation = 2;
    this.frame = 0;
    this.onGround = true;
  }

  draw() {
    ctx.fillStyle = "rgba(0, 255, 0,0.5)";
    ctx.fillRect(this.position.x+this.hitboxOffset.x, this.hitboxOffset.y+this.position.y, this.size.width + this.hitboxOffset.width, this.size.height + this.hitboxOffset.height);
    ctx.fillStyle = "rgba(255, 0, 0,0.2)";
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
    this.speed.x = 0;
    if (frame % (Math.floor(Math.random() * 1500) + 120) === 0) {
      const audio = new Audio("./sounds/zombie.mp3");
      audio.play();
    }
    if (!this.dead && this.health <= 0) {
      //en el momento en el que lo matan estaba vivo y es la primera vez que se muere
      //si está muerto no se puede morir más y se guarda la hora de la defunción
      //el frame de la animación se pone a 0 para que empiece a morirse
      this.animation = 2;
      this.dead = true;
      this.deathTime = frame;
      this.frame = 0;
      randomSound(deathSoundsEnemy);
    } else if (this.dead) {
      this.nextFrameDead();
      if (frame - this.deathTime > 300) {
        //aquí tiene que desaparecer el cadaver (o no)
        removeEnemy(this);
        enemies.push(new Enemy());
        enemies.push(new Enemy());
      }
    } else {
      this.nextAnimationFrame();
      //moverse en la dirección del jugador y mover la hitbox segun la posición
      if (player.position.x + 30 < this.position.x) {
        this.speed.x -= this.acceleration;
        this.animation = 0;
      }
      if (player.position.x - 30 > this.position.x) {
        this.speed.x += this.acceleration;
        this.animation = 1;
      }


      this.speed.y += gravity;

      //actualizar posición
      this.position.y += this.speed.y;
      this.position.x += this.speed.x;

      checkEnemyCollisions(this);

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
  nextFrameDead() {
    if (frame % 8 === 0) {
      if (this.frame >= 7) {
        this.frame = 7;
      } else {
        this.frame++;
      }
    }
  }
}
