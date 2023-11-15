class Projectile {
    constructor({ startX, startY, targetX, targetY, gameManager }) {
      this.position = { x: startX, y: startY };
      this.target = { x: targetX, y: targetY };
      this.speed = 10;
      this.width = 10;
      this.height = 2;
      this.angle = Math.atan2(this.target.y - this.position.y, this.target.x - this.position.x);
      this.gameManager=gameManager
    }
  
    draw() {
      this.gameManager.ctx.fillStyle = "yellow";
      this.gameManager.ctx.save();
      this.gameManager.ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
      this.gameManager.ctx.rotate(this.angle);
      this.gameManager.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      this.gameManager.ctx.restore();
    }
  
    update() {
        
      this.position.x += this.speed * Math.cos(this.angle);
      this.position.y += this.speed * Math.sin(this.angle);
    }
  }
  