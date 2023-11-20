onload = () => {
  newGame();

  canvas.style.cursor = "url('./img/aim_red.cur'), auto";
  //animation();
  setInterval(animation, 1000 / fps);
  //cambiar este setinterval por requestanimationframe cuando esté todo bien
  canvas.addEventListener("mousemove", function (event) {
    player.aim.x = event.clientX - canvas.getBoundingClientRect().left;
    player.aim.y = event.clientY - canvas.getBoundingClientRect().top;
  });
  addEventListener("keydown", handleKeyDown);
  addEventListener("keyup", handleKeyUp);
  addEventListener("mousedown", (e) => {
    keys.click = true;
  });
  addEventListener("mouseup", (e) => {
    keys.click = false;
  });

};

function animation() {
  if (!paused) {
    (frame===100) ? randomSound(newGameSounds) :
    (frame===500) ? newWave() :

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    updateDrawProjectiles();
    updateDrawBlocks();
    updateDrawEnemies();
    updateDrawPlayer();

    frame++;
  }
}

