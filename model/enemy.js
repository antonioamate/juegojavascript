
import Block from "/model/block.js";
import Player from "/model/player.js";
import Keys from "/model/keys.js";
import Projectile from "/model/projectile.js";

export default class Enemy {
  constructor(positionx) {
    this.lastBite = 0;
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
    ctx.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.size.width,
      this.hitbox.size.height
    );
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
      //moverse en la dirección del jugador y mover la hitbox
      if (player.position.x <= this.position.x) {
        this.speed.x -= this.acceleration;
        this.animation = 0;
        this.hitbox.position.x = this.position.x + 40;
        this.hitbox.position.y = this.position.y;
        this.hitbox.size.width = this.size.width - 80;
        this.hitbox.size.height = this.size.height;
      }
      if (player.position.x > this.position.x) {
        this.speed.x += this.acceleration;
        this.animation = 1;
        this.hitbox.position.x = this.position.x + 40;
        this.hitbox.position.y = this.position.y;
        this.hitbox.size.width = this.size.width - 80;
        this.hitbox.size.height = this.size.height;
      }
      //comprobar colisiones del enemigo con todos los bloques
      for (const block of blocks) {
        if (
          this.hitbox.position.x + this.speed.x < block.position.x + block.size.width &&
          this.hitbox.position.x + this.hitbox.size.width + this.speed.x > block.position.x &&
          this.hitbox.position.y + this.speed.y < block.position.y + block.size.height &&
          this.hitbox.position.y + this.hitbox.size.height + this.speed.y > block.position.y
        ) {
          this.speed.x = 0;
          this.speed.y = 0;
        }
      }
      //comprobar si colisiona con el jugador
      if (
        player.hitbox.position.x < this.hitbox.position.x + this.hitbox.size.width &&
        player.hitbox.position.x + player.hitbox.size.width > this.hitbox.position.x &&
        player.hitbox.position.y < this.hitbox.position.y + this.hitbox.size.height &&
        player.hitbox.position.y + player.hitbox.size.height > this.hitbox.position.y
        ) {
        //comprobar si el enemigo nos ha hecho daño hace más de medio segundo
        if (frame - this.lastBite > 30) {
          //morder al jugador
          this.lastBite = frame;
          player.health -= 5;
        }
      }
      this.nextAnimationFrame();

      //aplicar gravedad
      this.speed.y += gravity;

      comprobarBarrerasInvisibles(this);

      //actualizar posición
      this.position.y += this.speed.y;
      this.position.x += this.speed.x;
      //a partir de la posición del jugador obtengo
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
