import Player from '/model/player.js'
import Keys from '/model/keys.js'
import Enemy from '/model/enemy.js'
import Projectile from '/model/projectile.js'

export default class Block {
  constructor({ position, size }) {
    this.size = size;
    this.position = position;
  }

  draw() {
    ctx.fillStyle = "brown";
    ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
  }
}
