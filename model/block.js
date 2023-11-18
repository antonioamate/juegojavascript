class Block {
  constructor({ position, size }) {
    this.size = size;
    this.position = position;
  }

  draw() {
    ctx.fillStyle = "brown";
    ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
  }
}
