let score,
  playername,
  newgameTimestamp,
  playing,
  player,
  enemies,
  interval,
  ctx,
  canvas,
  backgroundImage,
  projectiles,
  keys,
  paused,
  fps,
  gravity,
  frame,
  killCount,
  wave,
  escaped,
  music,
  records,
  headshots;
const blocks = [
  new Block({
    x: 0,
    y: 370,
    width: 400,
    height: 20,
  }),
  new Block({
    x: 288,
    y: 203,
    width: 405,
    height: 20,
  }),
  new Block({
    x: 590,
    y: 370,
    width: 395,
    height: 20,
  }),
];

const playerDeathSounds = [
  "cr7",
  "fatality",
  "wasted",
  "windowsxp",
  "mariodeath",
  "astronomia",
  "funeral",
  "justdeath",
  "rickroll",
  "coolstory",
  "estudiar",
  "titanicflute",
  "tobecontinued",
];
const enemyDeathSounds = ["death-skeleton", "windowsxp", "estudiar"];
const enemyHitSounds = [
  "hurt1-skeleton",
  "hurt2-skeleton",
  "hurt3-skeleton",
  "hurt4-skeleton",
];
const playerHitSounds = ["minecrafthit", "punch", "minecraft-hurt"];
const beggingSounds = ["nogod", "nonono", "demon"];
const newWaveSounds = ["anenemy", "enemy", "dropping"];
const newGameSounds = ["herewegoagain"];
const bulletWoodSounds = ["bulletwood"];
const angryEnemySounds = ["zombie"];
const endWaveSounds = [];
const jumpSounds = ["mariojump"];

function randomSound(array) {
  let index = Math.floor(Math.random() * array.length);
  const audio = new Audio("./sounds/" + array[index] + ".mp3");
  audio.play();
  return audio;
}

function newGame() {
  newgameTimestamp = new Date();
  paused = false;
  playing = true;
  headshots = 0;
  escaped = 0;
  wave = 0;
  killCount = 0;
  enemies = [];
  paused = false;
  player = new Player();
  canvas.addEventListener("mousemove", (event) => {
    player.aim.x = event.clientX - canvas.getBoundingClientRect().left;
    player.aim.y = event.clientY - canvas.getBoundingClientRect().top;
  });
}
function drawData() {
  ctx.fillStyle = "#000";
  ctx.fillRect(20, 680, 200, 20);
  ctx.fillStyle = player.health > 33 ? "#33cc33" : "#cc0000";
  ctx.fillRect(20, 680, player.health * 2, 20);
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(player.health, 230, 700);
  if (killCount > 0) ctx.fillText("KILL COUNT = " + killCount, 300, 700);
  ctx.fillText(player.health, 230, 700);
  if (escaped > 0) ctx.fillText("ESCAPED = " + escaped, 600, 700);

  if (wave > 0) ctx.fillText("WAVE = " + wave, 900, 700);
  if (headshots > 0) ctx.fillText("HEADSHOTS = " + headshots, 900, 640);
}
function newWave() {
  randomSound(newWaveSounds);
  wave++;
  for (let i = 0; i < wave; i++) {
    enemies.push(new Enemy());
  }
}

//BARRERAS INVISIBLES
function checkGameBorders(object) {
  if (object.y + object.height + object.speed.y >= 540) {
    object.y = 540 - object.height;
    object.speed.y = 0;
    object.onGround = true;
  }
  if (object instanceof Player) {
    if (object.x + object.speed.x < 0) {
      object.x = 0;
      object.speed.x = 0;
    }
    if (object.x + object.width + object.speed.x >= 1280) {
      object.x = 1280 - object.width;
      object.speed.x = 0;
    }
  }

  if (
    object instanceof Enemy &&
    (object.x + object.width < 0 || object.x > 1280)
  ) {
    escaped++;
    object.beggingAudio.pause();
    removeEnemy(object);
  }
}

//IS COLLIDING
function isColliding(o1, o2) {
  return (
    o1.x < o2.x + o2.width &&
    o1.x + o1.width > o2.x &&
    o1.y < o2.y + o2.height &&
    o1.y + o1.height > o2.y
  );
}

//PLAYER/ENEMY BLOCK COLLISIONS
function checkBlockCollisions(object) {
  for (const block of blocks) {
    // Colisión desde arriba

    if (
      !object.goDown &&
      object.y + object.height + object.speed.y >= block.y &&
      object.y + object.height <= block.y &&
      object.x + object.width >= block.x &&
      object.x <= block.x + block.width
    ) {
      object.y = block.y - object.height;
      object.speed.y = 0;
      object.onGround = true;
    }
  }
}

//PLAYER COLLISIONS
function checkPlayerCollisions() {
  checkGameBorders(player);
  checkBlockCollisions(player);
  checkPlayerEnemyCollisions();
}
//PLAYER ENEMY COLLISION
function checkPlayerEnemyCollisions() {
  for (const enemy of enemies) {
    if (
      !enemy.dead &&
      isColliding(player, enemy) &&
      frame - enemy.lastBite > 30
    ) {
      //comprobar si el enemigo nos ha hecho daño hace más de medio segundo
      //morder al jugador
      console.log("player got bite");
      randomSound(playerHitSounds);
      enemy.lastBite = frame;
      player.health -= 20;
      //dependiendo de la posición del jugador con respecto al enemigo
      //se empuja al jugador a la izquierda o la derecha y siempre un poco hacia arriba
      if (player.x > enemy.x) {
        player.speed.x += 30;
        player.speed.y -= 5;
      } else {
        player.speed.x -= 30;

        player.speed.y -= 5;
      }
    }
  }
}
//ENEMY COLLISIONS
//llamar a esta funcion desde el update de enemy
function checkEnemyCollisions(enemy) {
  if (!enemy.dead) {
    checkBlockCollisions(enemy);
  }
  checkGameBorders(enemy);
}

//UPDATE DRAW PROJECTILES
function updateDrawProjectiles() {
  for (const projectile of projectiles) {
    projectile.update();
    projectile.draw();
  }
  projectiles = projectiles.filter(
    (projectile) =>
      projectile.x > 0 &&
      projectile.x < canvas.width &&
      projectile.y > 0 &&
      projectile.y < canvas.height
  );
}

//UPDATE DRAW ENEMIES
function updateDrawEnemies() {
  for (const enemy of enemies) {
    enemy.update();
    enemy.draw();
  }
}
//UPDATE DRAW BLOCKS
function updateDrawBlocks() {
  for (const block of blocks) {
    block.draw();
  }
}
//UPDATE DRAW PLAYER
function updateDrawPlayer() {
  player.update();
  player.draw();
}

//HANDLE KEYDOWN
function handleKeyDown(e) {
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
      break;
    case "e":
      player.currentGun.gunPistol = !player.currentGun.gunPistol;
      break;
    case "m":
      music.volume = music.volume > 0 ? (music.volume = 0) : (music.volume = 1);
      break;
  }
}
//HANDLE KEYUP

function handleKeyUp(e) {
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
}

//REMOVE ENEMY
function removeEnemy(enemy) {
  const index = enemies.indexOf(enemy);

  if (index !== -1) {
    enemies.splice(index, 1);
  }

  if (enemies.length < 1) {
    newWave();
  }
}
//REMOVE PROJECTILE
function removeProjectile(projectile) {
  const index = projectiles.indexOf(projectile);
  if (index !== -1) {
    projectiles.splice(index, 1);
  }
}
function updateRecords() {
  createTable()
  //aqui obtenemos los records del localstorage
  let recordsStorage = JSON.parse(localStorage.getItem("records")) || [];
  //se calcula la puntuación
  score = killCount - escaped + headshots;
  //se crea un nuevo record
  const newRecord = {
    score: score,
    headshots: headshots,
    killcount: killCount,
    escaped: escaped,
    wave: wave,
    started: newgameTimestamp.toISOString(),
    ended: new Date().toISOString(),
    name: playername,
  };
  records.push(...recordsStorage);
  records.push(newRecord);

  let root = document.getElementById("root");

  root.innerHTML = "";

  if (records) {
    let scoreA, scoreB;
    records.sort((a, b) => {
      scoreA = a.killcount - a.escaped + a.headshots;
      scoreB = b.killcount - b.escaped + b.headshots;
      return scoreB - scoreA;
    });

    records.forEach((record) => {
      let newRow = document.createElement("tr");

      // Llenar la fila con los datos del registro
      newRow.innerHTML = `
        <td>${record.score}</td>
        <td>${record.headshots}</td>
        <td>${record.killcount}</td>
        <td>${record.escaped}</td>
        <td>${record.wave}</td>
        <td>${record.started}</td>
        <td>${record.ended}</td>
        <td>${record.name}</td>
      `;
      root.appendChild(newRow);
    });
  }

  // Guardar el array actualizado en el LocalStorage
  localStorage.setItem("records", JSON.stringify(records));
}
function createTable() {
  let table = document.createElement("table");
  let thead = document.createElement("thead");
  let tbody = document.createElement("tbody");
  let headerRow = document.createElement("tr");
  let headers = ["Score", "Headshots", "Kill Count", "Escaped", "Wave", "Started", "Ended", "Player Name"];
  headers.forEach((headerText) => {
    let header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  table.appendChild(tbody);
  let root = document.getElementById("root");
  root.innerHTML = "";
  root.appendChild(table);
}
function randomNumber (min, max) {
  return Math.random() * (max - min) + min;
}