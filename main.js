onload = () => {
  const canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  const sharedContext = {
    ctx: ctx,
  };

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const keys = new Keys();

  const background = new Background({
    position: { x: 0, y: 0 },
    keys,
    sharedContext,
  });
  
  const player = new Player({
    position: { x: 50, y: 50 },
    keys,
    sharedContext,
  });
  
  
  function animation() {
    //limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.table(keys)

    background.update();
    player.update();
    
    background.draw(ctx);
    player.draw(ctx);
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
      case "ArrowUp":
        keys.arrowUp = true;
        break;
      case "ArrowDown":
        keys.arrowDown = true;
        break;
      case "ArrowLeft":
        keys.arrowLeft = true;
        break;
      case "ArrowRight":
        keys.arrowRight = true;
        break;
      case "+":
        keys.zoomIn = true;
        break;
      case "-":
        keys.zoomOut = true;
        break;
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
      case "ArrowUp":
        keys.arrowUp = false;
        break;
      case "ArrowDown":
        keys.arrowDown = false;
        break;
      case "ArrowLeft":
        keys.arrowLeft = false;
        break;
      case "ArrowRight":
        keys.arrowRight = false;
        break;
      case "+":
        keys.zoomIn = false;
        break;
      case "-":
        keys.zoomOut = false;
        break;
    }
  });
  background.image.onload = () => {
    // Usar requestAnimationFrame para la animación en lugar de setInterval
    function animate() {
      animation();
      requestAnimationFrame(animate);
    }

    animate(); // Iniciar la animación
  };
};

