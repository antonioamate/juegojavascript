function animation() {
  if (!paused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    

    updateDrawBlocks();
    updateDrawProjectiles();
    updateDrawEnemies();
    updateDrawPlayer();
    
    frame++;
  }
  /* setTimeout(() => {
    requestAnimationFrame(animation);
  }, 1000 / fps); */
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
  setInterval(animation, 1000 / fps);
  //cambiar este setinterval por requestanimationframe cuando esté todo bien
};
