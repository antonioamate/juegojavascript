
import Block from "/model/block.js";
import Player from "/model/player.js";
import Keys from "/model/keys.js";
import Enemy from "/model/enemy.js";

export default class Projectile {
  constructor({ position, target, angle }) {
    this.hitbox = {
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 2,
        height: 2,
      },
    };
    this.damage = 20;
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.target = {
      x: target.x,
      y: target.y,
    };
    this.speed = 20;
    this.size = {
      width: 10,
      height: 2,
    };
    this.angle = angle;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.save();
    ctx.translate(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
    ctx.rotate(this.angle);
    ctx.fillRect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
    ctx.restore();
    ctx.fillStyle = "cyan";
    //dibujar la hitbox de la bala
    //ctx.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.size.width, this.hitbox.size.height);
  }

  update() {
    this.position.x += this.speed * Math.cos(this.angle);
    this.position.y += this.speed * Math.sin(this.angle);

    this.hitbox.position.x = this.position.x + this.size.width / 2 - this.hitbox.size.width / 2;
    this.hitbox.position.y = this.position.y;
    //comprobar si está colisionando con bloques
    for (const block of blocks) {
      if (
        this.hitbox.position.x < block.position.x + block.size.width &&
        this.hitbox.position.x + this.hitbox.size.width > block.position.x &&
        this.hitbox.position.y < block.position.y + block.size.height &&
        this.hitbox.position.y + this.hitbox.size.height > block.position.y
      ) {
        removeProjectile(this);
      }
    }
  }
}
