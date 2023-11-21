onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  backgroundImage = new Image();
  canvas.style.cursor = "url('./img/aim_red.cur'), auto";
  keys = new Keys();
  projectiles = [];
  fps = 60;
  frame = 0;
  gravity = 0.3;
  music = new Audio("./sounds/franksinatra.mp3");
  music.loop = true;

    backgroundImage.src = "./img/forest.jpg";

    newGame();

    //cambiar este setinterval por requestanimationframe cuando esté todo bien

    canvas.addEventListener("mousemove", (event) => {
      player.aim.x = event.clientX - canvas.getBoundingClientRect().left;
      player.aim.y = event.clientY - canvas.getBoundingClientRect().top;
    });
    addEventListener("keydown", handleKeyDown);
    addEventListener("keyup", handleKeyUp);

    addEventListener("mousedown", (e) => {
      keys.click = true;
    });
    addEventListener
    addEventListener("mouseup", (e) => {
      keys.click = false;
    });

    setInterval(animation, 1000 / fps);
  };


function animation() {
  if (!paused) {
    if (frame === 1) randomSound(newGameSounds);
    if (frame === 200) music.play();
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
