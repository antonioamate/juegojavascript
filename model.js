class Background {
  constructor({ position, keys, sharedContext }) {
    this.position = position;
    this.keys = keys;
    this.sharedContext = sharedContext;
    this.image = new Image();
    this.image.src = "./img/background.png";
    this.zoomSpeed = 1.01;
    this.speed = 10;
    this.zoom = this.maxZoom = Math.max(canvas.width / this.image.width, canvas.height / this.image.height);
    this.target = {
      x: this.image.height * this.zoom,
      y: this.image.width * this.zoom,
    };
  }
  draw() {
    this.update();
    this.validarZoom();

    this.sharedContext.ctx.drawImage(this.image, -this.position.x, -this.position.y, this.target.x, this.target.y);
  }
  update() {
    if (this.keys.arrowLeft) this.position.x -= this.speed;
    if (this.keys.arrowRight) this.position.x += this.speed;
    if (this.keys.arrowDown) this.position.y += this.speed;
    if (this.keys.arrowUp) this.position.y -= this.speed;
    if (this.keys.zoomIn) this.zoom = this.zoom * this.zoomSpeed;
    if (this.keys.zoomOut) this.zoom = this.zoom / this.zoomSpeed;
  }
  validarZoom() {
    if (this.zoom < this.maxZoom) this.zoom = this.maxZoom;
    this.target.y = this.image.height * this.zoom;
    this.target.x = this.image.width * this.zoom;
    if (this.position.x + canvas.width > this.target.x) this.position.x = this.target.x - canvas.width;
    if (this.position.y + canvas.height > this.target.y) this.position.y = this.target.y - canvas.height;
    if (this.position.x < 0) this.position.x = 0;
    if (this.position.y < 0) this.position.y = 0;
  }
}

class Player {
  constructor({ position, keys, sharedContext, background }) {
    this.position = position;
    this.background = background;
    this.keys = keys;
    this.sharedContext = sharedContext;
    this.image = new Image();
    this.image.src = "./img/spritestick.png";
    this.speed = 10;
    this.relativeFrame=0
    this.size = {
      width: 200,
      height: 250,
    };
    this.escala = 0.4;
    this.animation = 2;
    this.frame = 0;
    this.facingRight = true;
    this.covered = false;
    this.onGround = false;
  }
  draw() {
    this.sharedContext.ctx.fillStyle= 'rgba(255, 0, 0,.5)'
    this.sharedContext.ctx.fillRect(this.position.x,this.position.y,200*this.background.zoom * this.escala,250 * this.background.zoom * this.escala )
    this.sharedContext.ctx.drawImage(
      this.image,
      this.frame * 200, //por donde empieza a recortar la imagen
      this.animation * 250,
      200, //lo que recorta de la imagen fuente
      250,
      this.position.x, //donde coloca la imagen
      this.position.y,
      200 * this.background.zoom * this.escala, //dimensiones de la imagen escalada
      250 * this.background.zoom * this.escala
    );
  }
  update() {
    this.unCover()
    this.relativeFrame++
    if(this.relativeFrame%8===0){
      this.walk()
    }
    
    if (this.keys.w) {
      this.position.y -= this.speed;
    }
    if (this.keys.a) {
      this.position.x -= this.speed;
    }
    if (this.keys.s) {
      this.cover();
    }
    if (this.keys.d) {
      this.position.x += this.speed;
    }
  }
  jump() {
    if (this.onGround) {
      this.velocity.y = -15;
    }
  }
  unCover() {
    if (this.covered) {
      this.animation = 2;
      this.covered = false;
    }
  }
  cover() {
    if (!this.covered) {
      this.animation = 4;
      this.covered = true;
    }
  }
  walk() {
    if (this.frame < 7) {
      this.frame++;
    } else {
      this.frame = 2;
    }
  }
}

class Keys {
  constructor() {
    this.w = false;
    this.a = false;
    this.s = false;
    this.d = false;
    this.arrowUp = false;
    this.arrowDown = false;
    this.arrowLeft = false;
    this.arrowRight = false;
    this.zoomIn = false;
    this.zoomOut = false;
  }
}
