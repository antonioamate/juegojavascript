class Enemy {
  constructor() {
    this.goDown = false;
    this.goDownTimestamp=0;
    this.lastJumpFrameStamp=0
    this.beggingAudio;
    this.agressive = true;
    this.lastBite = 0;
    this.health = 100;
    this.dead = false;
    this.deathTime = 0;
    this.limitPain=randomNumber(10,90)
    this.x = (Math.random() * 100)+1100;
    this.birthDay=new Date()
    this.y = 100;
    this.width = 60;
    this.height = 125;
    this.image = new Image();
    this.image.src = "./img/spriteenemy.png";
    this.speed = {
      x: 0,
      y: 0,
    };
    this.acceleration = Math.random()+0.5;
    this.animation = 0;
    this.frame = 0;
    this.onGround = true;
    this.frameCooldown = 8;
  }

  draw() {
    //ctx.fillStyle = "rgba(255, 0, 0,0.2)";
    //ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * 100 + 20, //por donde empieza a recortar la imagen
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
    if (this.health <= this.limitPain && this.agressive) {
      this.agressive = false;
      this.acceleration = 3;
      this.frameCooldown = 2;
      this.beggingAudio = randomSound(beggingSounds);
    }
    //condicional para saber si el enemigo se está muriendo, si está muerto o vivo
    if (!this.dead && this.health <= 0) {
      this.animation = 2;
      this.dead = true;
      this.deathTime = frame;
      this.frame = 0;
      killCount++;
      randomSound(enemyDeathSounds);
    } else if (this.dead) {
      this.beggingAudio.pause();
      this.nextFrameDead();
      if (frame - this.deathTime > 400) {
        //aquí tiene que desaparecer el cadaver (o no)
        removeEnemy(this);
      }
    } else {
      if (frame % (Math.floor(Math.random() * 1500) + 120) === 0) {
        randomSound(angryEnemySounds)
      }
      this.nextAnimationFrame();
      //si está agresivo corre hacia ti
      if (this.agressive) {
        if (player.x + 30 < this.x) {
          this.speed.x -= this.acceleration;
          this.animation = 0;
        } else if (player.x - 30 > this.x) {
          this.speed.x += this.acceleration;
          this.animation = 1;
        }
        //si está por debajo del jugador salta
        if (this.y > player.y + 10) {
          this.jump();
        }
        if (this.y < player.y -10) {
          this.goDown=true
        }else {
          this.goDown=false
        }
      } else {
        //huir del jugador
        if (player.x < this.x) {
          this.speed.x += this.acceleration;
          this.animation = 1;
        } else if (player.x > this.x) {
          this.speed.x -= this.acceleration;
          this.animation = 0;
        }
      }

      this.speed.y += gravity;
      checkEnemyCollisions(this);

      //actualizar posición
      this.y += this.speed.y;
      this.x += this.speed.x;
    }
  }
  jump() {
    if (this.onGround && frame - this.lastJumpFrameStamp > randomNumber(300,600)) {
      this.speed.y -= randomNumber(15,20);
      this.onGround = false;
      this.lastJumpFrameStamp=frame
    }
  }
  nextAnimationFrame() {
    if (frame % this.frameCooldown === 0) {
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
