onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  backgroundImage = new Image();
  backgroundImage.src = "./img/forest.jpg";
  canvas.style.cursor = "url('./img/aim_red.cur'), auto";
  keys = new Keys();
  fps = 60;
  gravity = 0.3;
  music = new Audio("./sounds/franksinatra.mp3");
  music.loop=true
  music.play()
  projectiles = [];
  frame = 0;

  newGame();

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
    if (frame === 60) randomSound(newGameSounds);
    if (frame === 333) newWave();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    updateDrawProjectiles();
    updateDrawBlocks();
    updateDrawEnemies();
    updateDrawPlayer();
    drawData();
    frame++;
  }
}
