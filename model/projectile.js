class Projectile {
  constructor({ x, y, target, angle, damage, gunPistol }) {
    this.damage = damage;
    this.x = x;
    this.y = y;
    this.target = {
      x: target.x,
      y: target.y,
    };
    this.speed = 40;
    this.width = 10;
    this.height = 2;
    this.angle = angle;
    this.gunPistol = gunPistol;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.angle);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }

  update() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);

    //comprobar si está colisionando con bloques
    for (const block of blocks) {
      if (isColliding(this, block)) {
        removeProjectile(this);
        console.log("block got shot");
        randomSound(bulletWoodSounds);
        return;
      }
    }
    for (const enemy of enemies) {
      if (!enemy.dead && isColliding(this, enemy)) {
        let actualDamage = 0;
        if (this.gunPistol) {
          if (this.y < enemy.y + 20) {
            //disparo en la cabeza
            actualDamage = 100;
            headshots++;
            console.log("headshot!");
          } else if (this.y < enemy.y + 75) {
            //disparo en el torso
            actualDamage = 80;
          }else {
            //disparo en las piernas
            actualDamage=5
          }
        } else {
          if (this.y < enemy.y + 20) {
            //disparo en la cabeza
            actualDamage = 100;
            headshots++;
            console.log("headshot!");
          } else if (this.y < enemy.y + 75) {
            //disparo en el torso
            actualDamage = 10;
          }else{
            //disparo en las piernas
            actualDamage=5
          }
        }
        enemy.health -= actualDamage;
        removeProjectile(this);
        console.log("enemy got shot");
        randomSound(enemyHitSounds);
        return;
      }
    }
  }
}
