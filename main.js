function animation() {
  if (!paused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    

    updateDrawProjectiles();
    updateDrawBlocks();
    updateDrawEnemies();
    updateDrawPlayer();
    
    frame++;
  }

    requestAnimationFrame(animation);

}

onload = () => {
  
  newGame()
  
  addEventListener("keydown", handleKeyDown)
  addEventListener("keyup", handleKeyUp);
  addEventListener("mousedown", (e) => {
    keys.click = true;
  });
  addEventListener("mouseup", (e) => {
    keys.click = false;
  });
  canvas.addEventListener("mousemove", function (event) {
    player.aim.x = event.clientX - canvas.getBoundingClientRect().left;
    player.aim.y = event.clientY - canvas.getBoundingClientRect().top;
  });
  window.addEventListener('wheel', handleScroll);
  canvas.style.cursor = "url('./img/aim_red.cur'), auto";
  //animation();
  animation()
  //cambiar este setinterval por requestanimationframe cuando esté todo bien
};
