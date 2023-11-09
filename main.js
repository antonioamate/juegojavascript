// Cuando la ventana se carga por completo
window.onload = function () {
  // Constante para la posición límite derecha
  const TOPEDERECHA = 800;

  // Posiciones iniciales
  let x = 600;
  let y = 50;

  // Obtener el canvas y el contexto de dibujo
  let canvas = document.getElementById("miCanvas");
  let ctx = canvas.getContext("2d");
  let id1, id2;
  let xIzquierda, xDerecha;
  let posicion = 0;
  let ejecutarDerecha = true;
  let miStick;

  // Cargar la imagen del sprite
  let imagen = new Image();
  imagen.src = "spritestick.png";

  // Definición de la clase Stick
  function Stick(x_, y_) {
    this.x = x_;
    this.y = y_;
    this.animacionStick = [
      [
        [2108.341, 5.948],
        [62.067, 256.729],
      ],
      [
        [0, 4.114],
        [208.215, 258.563],
      ],
      [
        [297.622, 3.443],
        [165.080, 259.234],
      ],
      [
        [561.092, 7,496],
        [156.099, 255.181],
      ],
      [
        [804,286, 8,722],
        [167.392, 253.955],
      ],
      [
        [1027.147, 8,118],
        [199.019, 254.559],
      ],
      [
        [1344.450, 1.436],
        [136.204, 261,241],
      ],
      [
        [1613.544, 3.972],
        [121.598, 258.705],
      ],
      [
        [1836.784, 6.767],
        [152.846, 255.910],
      ],
    ];
    this.velocidad = 1.4;
  }

  // Método para generar la posición a la derecha
  Stick.prototype.generaPosicionDerecha = function () {
    this.x = Math.min(this.x + this.velocidad, TOPEDERECHA);
  };

  // Método para generar la posición a la izquierda
  Stick.prototype.generaPosicionIzquierda = function () {
    this.x = Math.max(this.x - this.velocidad, 0);
  };

function pintaStick() {
  ctx.clearRect(0, 0, 800, 600);

  if (!xDerecha && !xIzquierda) {
    posicion=0
  }
  if (xDerecha) miStick.generaPosicionDerecha();
  if (xIzquierda) miStick.generaPosicionIzquierda();
  ctx.save(); // Guardar el estado del contexto

  if (ejecutarDerecha) {
    ctx.drawImage(
      miStick.imagen,
      miStick.animacionStick[posicion][0][0],
      miStick.animacionStick[posicion][0][1],
      miStick.animacionStick[posicion][1][0],
      miStick.animacionStick[posicion][1][1],
      miStick.x,
      miStick.y
    );
  } else {
    ctx.scale(-1, 1); // Voltear horizontalmente
    ctx.drawImage(
      miStick.imagen,
      miStick.animacionStick[posicion][0][0],
      miStick.animacionStick[posicion][0][1],
      miStick.animacionStick[posicion][1][0],
      miStick.animacionStick[posicion][1][1],
      miStick.x - miStick.animacionStick[posicion][1][0], // Coordenada x invertida
      miStick.y,
      miStick.animacionStick[posicion][1][0],
      miStick.animacionStick[posicion][1][1]
    );
  }

  ctx.restore(); // Restaurar el estado original del contexto
}


  // Función para alternar la animación del stick
  function movimiento() {
    if (posicion === 0 ){
      return
    }
    else if (posicion > 7) {
      posicion=1
    } else {
      posicion++
    }
  }

  // Funciones para activar los sprites en las direcciones correspondientes
  function activarSpriteIzquierda() {
    if (ejecutarDerecha){
      posicion = 1;
      ejecutarDerecha = false;
    } 
  }

  function activarSpriteDerecha() {
    if (!ejecutarDerecha){
      posicion = 1;
      ejecutarDerecha = true;
    }
  }

  // Funciones para manejar eventos de teclado
  function activaMovimiento(evt) {
    switch (evt.keyCode) {
      case 65: // Flecha izquierda
        xIzquierda = true;
        activarSpriteIzquierda();
        break;
      case 68: // Flecha derecha
        xDerecha = true;
        activarSpriteDerecha();
        break;
    }
  }

  function desactivaMovimiento(evt) {
    switch (evt.keyCode) {
        case 65: // Flecha izquierda
            xIzquierda = false;
            if (!xDerecha) {
                posicion = 0;
            }
            break;
        case 68: // Flecha derecha
            xDerecha = false;
            if (!xIzquierda) {
                posicion = 0;
            }
            break;
    }
}

  // Agregar listeners para los eventos de teclado
  document.addEventListener("keydown", activaMovimiento, false);
  document.addEventListener("keyup", desactivaMovimiento, false);

  Stick.prototype.imagen = imagen;
  miStick = new Stick(x, y);

  // Iniciar las animaciones en intervalos de tiempo
  id1 = setInterval(pintaStick, 1000 / 50);
  id2 = setInterval(movimiento, 1000 / 1);
};
