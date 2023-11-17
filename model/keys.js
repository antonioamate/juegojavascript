import * as global from './global.js'
import * as data from './data.js'
import * as main from "./main.js";
import Block from './model/block.js'
import Player from './model/player.js'
import Enemy from './model/enemy.js'
import Projectile from './model/projectile.js'

export default class Keys {
  constructor() {
    (this.w = false), (this.a = false), (this.s = false), (this.d = false), (this.click = false);
  }
}
