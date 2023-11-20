class Block {
  constructor({x, y, width, height}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = "#4e3c2e";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
