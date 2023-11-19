class Projectile {
  constructor({ x, y, target, angle }) {
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
    this.x = x;
    this.y = y;
    this.target = {
      x: target.x,
      y: target.y,
    };
    this.speed = 20;
    this.width = 10;
    this.height = 2;
    this.angle = angle;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
    //ctx.fillStyle = "cyan";
    //dibujar la hitbox de la bala
    //ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);

    //comprobar si está colisionando con bloques
    for (const block of blocks) {
      if (isColliding(this, block)) {
        removeProjectile(this);
        console.log("block got shot");
        return;
      }
    }
    for (const enemy of enemies) {
      if (isColliding(this, enemy)) {
        enemy.health -= this.damage;
        removeProjectile(this);
        console.log("enemy got shot");
        return;
      }
    }
  }
}
