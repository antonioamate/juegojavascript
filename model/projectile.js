class Projectile {
  constructor({ position, target, angle }) {
    this.damage = 30;
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
    console.log(this.angle);
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.save();
    ctx.translate(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2);
    ctx.rotate(this.angle);
    ctx.fillRect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
    ctx.restore();
  }

  update() {

    this.position.x += this.speed * Math.cos(this.angle);
    this.position.y += this.speed * Math.sin(this.angle);
  }
}
