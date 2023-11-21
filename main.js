onload = () => {
  paused=true
  playing=false
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
  
  
  addEventListener("keydown", handleKeyDown);
  addEventListener("keyup", handleKeyUp);

  addEventListener("mousedown", (e) => {
    keys.click = true;
  });
  addEventListener;
  addEventListener("mouseup", (e) => {
    keys.click = false;
  });
  playernameInput = document.getElementById("playernameInput");
  let newgamebutton = document.getElementById("newgame");

  playernameInput.addEventListener("input", function () {
    newgame.disabled = playernameInput.value.trim() === "";
  });

  newgamebutton.addEventListener("click", function () {
    if (playernameInput.value.trim() !== "" && !playing) {
      newGame()
      playername=playernameInput.value.trim()
    }
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
