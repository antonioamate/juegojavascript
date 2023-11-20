class Enemy {
  constructor() {
    this.lastBite = 0;
    this.health = 100;
    this.dead = false;
    this.deathTime = 0;
    this.x= Math.random() * 1270;
    this.y= 100;
    this.width= 60;
    this.height= 125;
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

    ctx.fillStyle = "rgba(255, 0, 0,0.2)";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      (this.frame * 100)+20, //por donde empieza a recortar la imagen
      this.animation * 125,
      60, //lo que recorta de la imagen fuente
      125,
      this.x, //donde pone la imagen
      this.y,
      60, //dimensiones de la imagen a dibujar (dejarlo igual)
      125
    );
  }
  update() {
    this.speed.x = 0;
    
    if (!this.dead && this.health <= 0) {
      //en el momento en el que lo matan estaba vivo y es la primera vez que se muere
      //si está muerto no se puede morir más y se guarda la hora de la defunción
      //el frame de la animación se pone a 0 para que empiece a morirse
      this.animation = 2;
      this.dead = true;
      this.deathTime = frame;
      this.frame = 0;
      randomSound(enemyDeathSounds);
    } else if (this.dead) {
      this.nextFrameDead();
      if (frame - this.deathTime > 300) {
        //aquí tiene que desaparecer el cadaver (o no)
        removeEnemy(this);
      }
    } else {
      if (frame % (Math.floor(Math.random() * 1500) + 120) === 0) {
        const audio = new Audio("./sounds/zombie.mp3");
        audio.play();
      }
      this.nextAnimationFrame();
      //moverse en la dirección del jugador y mover la hitbox segun la posición
      if (player.x + 30 < this.x) {
        this.speed.x -= this.acceleration;
        this.animation = 0;
      }
      else if (player.x - 30 > this.x) {
        this.speed.x += this.acceleration;
        this.animation = 1;
      }


      this.speed.y += gravity;

      //actualizar posición
      this.y += this.speed.y;
      this.x += this.speed.x;

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
