import * as g from './global.js'
import Block from './model/block.js'
import Player from './model/player.js'
import Keys from './model/keys.js'
import Enemy from './model/enemy.js'
import Projectile from './model/projectile.js'

function animation() {
  if (!g.paused) {
    g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);
    g.ctx.drawImage(g.backgroundImage, 0, 0, g.canvas.width, g.canvas.height);
    
    g.checkAllCollisions();
    g.updateDrawBlocks();
    g.updateDrawEnemies();
    g.updateDrawProjectiles();
    g.updateDrawPlayer();
    
    g.frame++;
  }
  /* setTimeout(() => {
    requestAnimationFrame(animation);
  }, 1000 / fps); */
}

onload = () => {
  
  g.newGame()
  
  addEventListener("keydown", g.handleKeyDown)
  addEventListener("keyup", g.handleKeyUp);
  addEventListener("mousedown", (e) => {
    g.keys.click = true;
  });
  addEventListener("mouseup", (e) => {
    g.keys.click = false;
  });
  canvas.addEventListener("mousemove", function (event) {
    g.player.aim.x = event.clientX - g.canvas.getBoundingClientRect().left;
    g.player.aim.y = event.clientY - g.canvas.getBoundingClientRect().top;
  });
  window.addEventListener('wheel', g.handleScroll);
  g.canvas.style.cursor = "url('./img/aim_red.cur'), auto";
  //animation();
  setInterval(animation, 1000 / g.fps);
  //cambiar este setinterval por requestanimationframe cuando esté todo bien
};
