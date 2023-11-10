window.onload = function () {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let id1, id2;
  class Player {
    constructor(){
      (this.position = {
        x: 100,
        y: 100,
      }),
      (this.dimensions = {
          x: 100,
          y: 100,
      }),
      
    }
  }

  document.addEventListener("keydown", activaMovimiento, false);
  document.addEventListener("keyup", desactivaMovimiento, false);

  id1 = setInterval(pintaStick, 1000 / 50);
  id2 = setInterval(movimiento, 1000 / 1);
};
