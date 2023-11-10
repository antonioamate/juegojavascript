onload = () => {
  const canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const player = new Player({ x: 50, y: 50 });
  const keys = new Keys();
  const background = new Background({
    position: { x: 0, y: 0 },
    imageSrc: "./img/background.png",
    sourceRect: { x: 0, y: 0, width: canvas.width, height: canvas.height },
    scale: 1,
  });

  function animation(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    background.draw(ctx);
    player.draw(ctx)
  }

  addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = true;
        break;
      case "a":
        keys.a.pressed = true;
        break;
      case "s":
        keys.s.pressed = true;
        break;
      case "d":
        keys.d.pressed = true;
        break;
    }
  });

  addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "s":
        keys.s.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
    }
  });

  let id1 = setInterval(animation(ctx), 1000 / 50);
  let id2 = setInterval(() => player.walk(), 1000 / 1);
};
