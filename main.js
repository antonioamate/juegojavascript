let player, enemies, blocks, interval, ctx, canvas, backgroundImage, projectiles, keys, paused, fps, gravity, frame, killCount;

fps = 60;
gravity = 0.3;
onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  backgroundImage = new Image();
  backgroundImage.src = "./img/forest.jpg";
  keys = new Keys();
  newGame()
  function animation() {
    if (!paused) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
      
      checkAllCollisions();
      updateDrawBlocks();
      updateDrawEnemies();
      updateDrawProjectiles();
      updateDrawPlayer();
      
      frame++;
    }
    /* setTimeout(() => {
      requestAnimationFrame(animation);
    }, 1000 / fps); */
  }
  

  addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        keys.w = true;
        break;
      case "a":
        keys.a = true;
        break;
      case "s":
        keys.s = true;
        break;
      case "d":
        keys.d = true;
        break;
      case "p":
        paused = !paused;
    }
  });
  addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        keys.w = false;
        break;
      case "a":
        keys.a = false;
        break;
      case "s":
        keys.s = false;
        break;
      case "d":
        keys.d = false;
        break;
    }
  });
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

  function handleScroll(event) {
    let delta = event.deltaY;
    console.log(delta)
  }
  window.addEventListener('wheel', handleScroll);

  canvas.style.cursor = "url('./img/aim_red.cur'), auto";
  //animation();
  setInterval(animation, 1000 / fps);
};
