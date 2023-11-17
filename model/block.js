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
blocks = [
  new Block({
    position: { x: 400, y: 440 },
    size: { width: 50, height: 100 },

  }),
  new Block({
    position: { x: 200, y: 200 },
    size: { width: 50, height: 100 },
  }),
];
