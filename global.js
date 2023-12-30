let ammoBoxes,
	score,
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
//array de bloques
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

//arrays de sonidos aleatorios
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
	"evilmorty",
];
const enemyDeathSounds = ["death-skeleton", "windowsxp", "pum", "valorantkill", "zasca"];
const enemyHitSounds = ["hurt1-skeleton", "hurt2-skeleton", "hurt3-skeleton", "hurt4-skeleton"];
const playerHitSounds = ["minecrafthit", "punch", "minecraft-hurt"];
const beggingSounds = ["nogod", "nonono", "demon", "policia"];
const newWaveSounds = ["anenemy", "enemy", "dropping"];
const newGameSounds = ["herewegoagain"];
const bulletWoodSounds = ["bulletwood", "hitmarker"];
const angryEnemySounds = ["zombie"];
const jumpSounds = ["mariojump", "superJump"];
const ammoLootSounds = ["ammoloot"];
//reproducir un sonido aleatorio
function randomSound(array) {
	let index = Math.floor(Math.random() * array.length);
	const audio = new Audio("./sounds/" + array[index] + ".mp3");
	audio.play();
	//devolver el audio para poder manejarlo en un futuro
	return audio;
}

function newGame() {
	//en newgame se inicia una nueva partida y se resetean los datos, se crea un nuevo jugador y se quita el pause
	frame = 0;
	newgameTimestamp = new Date();
	paused = false;
	playing = true;
	headshots = 0;
	escaped = 0;
	wave = 0;
	killCount = 0;
	enemies = [];
	ammoBoxes = [];
	paused = false;
	player = new Player();
	//escuchar el movimiento del ratón
	canvas.addEventListener("mousemove", (event) => {
		player.aim.x = event.clientX - canvas.getBoundingClientRect().left;
		player.aim.y = event.clientY - canvas.getBoundingClientRect().top;
	});
}
function drawData() {
	ctx.fillStyle = "#000";
	ctx.fillRect(20, 680, 200, 20);
	//si la salud está por debajo de 33 se pinta la barra de rojo y si es mayor de verde
	ctx.fillStyle = player.health > 33 ? "#33cc33" : "#cc0000";
	ctx.fillRect(20, 680, player.health * 2, 20);

	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.fillText(player.health, 230, 700);
	//killcount
	if (killCount > 0) ctx.fillText("KILL COUNT = " + killCount, 300, 700);
	//salud del jugador
	ctx.fillText(player.health, 230, 700);
	//enemigos fugados
	if (escaped > 0) ctx.fillText("ESCAPED = " + escaped, 600, 700);
	//datos munición uzi
	ctx.fillText("UZI " + player.uzi.currentMagazine + "/" + player.uzi.magazineCapacity + " " + player.uzi.magazines, 20, 640);
	//barra de recarga uzi
	if (player.uzi.reloading) ctx.fillRect(20, 645, (frame - player.uzi.reloadFrameStamp) * 1.5, 5);
	//datos munición pistola
	ctx.fillText("PISTOL " + player.pistol.currentMagazine + "/" + player.pistol.magazineCapacity + " " + player.pistol.magazines, 300, 640);
	//bara de recarga pistola
	if (player.pistol.reloading) ctx.fillRect(300, 645, (frame - player.pistol.reloadFrameStamp) * 1.5, 5);
	//información de ola
	if (wave > 0) ctx.fillText("WAVE = " + wave, 900, 700);
	//número de headshots
	if (headshots > 0) ctx.fillText("HEADSHOTS = " + headshots, 900, 640);
}

//BARRERAS INVISIBLES
function checkGameBorders(object) {
	//comprobar si están tocando el suelo
	if (object.y + object.height + object.speed.y >= 540) {
		object.y = 540 - object.height;
		object.speed.y = 0;
		object.onGround = true;
	}
	//si el objeto es un jugador se comprueba que no salga por los laterales
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
	//si el objeto es un enemigo se comprueba si salen por los laterales y se incrementa el número de fugados
	if (object instanceof Enemy && (object.x + object.width < 0 || object.x > 1280)) {
		escaped++;
		//se para el audio donde gritan por su vida al salir del juego y se elimina el enemigo del array
		object.beggingAudio.pause();
		removeEnemy(object);
	}
}

//PLAYER ENEMY COLLISION
function checkPlayerEnemyCollisions() {
	for (const enemy of enemies) {
		if (!enemy.dead && isColliding(player, enemy) && frame - enemy.lastBite > 30) {
			//comprobar si el enemigo nos ha hecho daño hace más de medio segundo
			//morder al jugador
			console.log("player got bite");
			randomSound(playerHitSounds);
			enemy.lastBite = frame;
			player.health -= enemy.damage;
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

//UPDATE DRAW PROJECTILES
function updateDrawProjectiles() {
	for (const projectile of projectiles) {
		projectile.update();
		projectile.draw();
	}
	//filtrar las balas que estén fuera del juego y eliminarlas del array de balas
	projectiles = projectiles.filter((projectile) => projectile.x > 0 && projectile.x < canvas.width && projectile.y > 0 && projectile.y < canvas.height);
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
		//cambiar de arma al pulsar E
		case "e":
			player.currentGun.gunPistol = !player.currentGun.gunPistol;
			break;
		//recargamos el arma que tengamos en ese momento
		case "r":
			player.currentGun.gunPistol ? player.reloadPistol() : player.reloadUzi();
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
	//comprobar si ya no quedan enemigos cuando se mata a uno y si no quedan empezar una nueva ola
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
//crear una nueva ola y reproducir un sonido aleatorio de nueva ola
function newWave() {
	randomSound(newWaveSounds);
	wave++;
	//spawneamos tantos enemigos como sea el número de ola
	for (let i = 0; i < wave; i++) {
		enemies.push(new Enemy());
	}
}

//IS COLLIDING
function isColliding(o1, o2) {
	return o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y;
}

//PLAYER/ENEMY BLOCK COLLISIONS
//comprobar colisiones con bloques
function checkBlockCollisions(object) {
	for (const block of blocks) {
		//por cada bloque, si el jugador no tiene activado el modo ir abajo y va a colisionar por arriba del bloque se pone al jugador encima del bloque, la velocidad se pone a 0 y
		//se establece que el jugador está en el suelo
		if (!object.goDown && object.y + object.height + object.speed.y >= block.y && object.y + object.height <= block.y && object.x + object.width >= block.x && object.x <= block.x + block.width) {
			object.y = block.y - object.height;
			object.speed.y = 0;
			object.onGround = true;
		}
	}
}

//PLAYER COLLISIONS
//comprobar las colisiones del jugador
function checkPlayerCollisions() {
	checkGameBorders(player);
	checkBlockCollisions(player);
	checkPlayerEnemyCollisions();
	checkAmmoCollisions();
}
//comprobar si estamos colisionando con cajas de munición y cogerlas
function checkAmmoCollisions() {
	for (ammo of ammoBoxes) {
		if (isColliding(player, ammo)) {
			player.uzi.magazines++;
			player.pistol.magazines++;
			randomSound(ammoLootSounds);
			removeAmmo(ammo);
		}
	}
}
//REMOVE AMMO
function removeAmmo(ammo) {
	const index = ammoBoxes.indexOf(ammo);
	if (index !== -1) {
		ammoBoxes.splice(index, 1);
	}
}

//ENEMY COLLISIONS
//llamar a esta funcion desde el update de enemy
function checkEnemyCollisions(enemy) {
	//si el enemigo está muerto no se comprueban las colisiones con los bloques
	if (!enemy.dead) {
		checkBlockCollisions(enemy);
	}
	checkGameBorders(enemy);
}

function updateRecords() {
	//aqui obtenemos los records del localstorage
	let recordsStorage = JSON.parse(localStorage.getItem("records")) || [];
	//si no hay records en el localstorage no se añaden al array records
	if (recordsStorage && recordsStorage.length > 0) records.push(...recordsStorage);
	//se calcula la puntuación
	score = killCount - escaped + headshots;
	//se crea un nuevo record
	const newRecord = {
		score: score,
		headshots: headshots,
		killcount: killCount,
		escaped: escaped,
		wave: wave,
		started: formatDate(newgameTimestamp),
		ended: formatDate(new Date()),
		name: playername,
	};
	records.push(newRecord);

	if (records) {
		let scoreA, scoreB;
		//ordenar los records por puntuación
		records.sort((a, b) => {
			scoreA = a.killcount - a.escaped + a.headshots;
			scoreB = b.killcount - b.escaped + b.headshots;
			return scoreB - scoreA;
		});
		//crear las filas
		records.forEach((record) => {
			let newRow = document.createElement("tr");

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
			table.appendChild(newRow); //agregar la fila a la tabla
		});
	}

	//guardar los records en localstorage
	localStorage.setItem("records", JSON.stringify(records));
}
//funcion para obtener un número aleatorio entre dos números incluidos
function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}
//función para actualizar la munición que aparece y dibujarla
function updateDrawAmmo() {
	for (const ammo of ammoBoxes) {
		ammo.update();
		ammo.draw();
	}
}
//funcion para pasar un objeto fecha a formato string YYYY-MM-DD HH:MM:SS
function formatDate(date) {
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
