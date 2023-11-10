class Background {
    constructor({ position, imageSrc, sourceRect = null, scale = 1 }) {
      this.position = position;
      this.image = new Image();
      this.image.src = imageSrc;
      this.sourceRect = sourceRect;
      this.scale = scale;
    }
  
    draw(ctx) {
        ctx.drawImage(
          this.image,
          this.sourceRect.x, this.sourceRect.y, this.sourceRect.width, this.sourceRect.height,
          this.position.x, this.position.y,
          this.sourceRect.width * this.scale, this.sourceRect.height * this.scale
        );
    }
  
    update() {


    }
  }
  
class Player {
  constructor(position) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.size = {
      width: 100,
      height: 100,
    };
    this.covered = false;
    this.onGround = false;
  }
  cover(state) {
    this.covered = state;
  }
  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
  update() {


  }
  jump() {
    if (this.onGround) {
      this.velocity.y=-15
    }
  }
  walk(){
    console.log("andar")

  }
}
class Keys {
  constructor() {
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false;
  }
}
