onload = () => {
	paused = true;
	playing = false;
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	backgroundImage = new Image();
	canvas.style.cursor = "url('./img/aim_red.cur'), auto";
	keys = new Keys();
	projectiles = [];
	records = [];
	fps = 60;
	frame = 0;
	gravity = 0.3;
	music = new Audio("./sounds/franksinatra.mp3");
	music.loop = true;

	backgroundImage.src = "./img/forest.jpg";
	//escuchar las teclas y el click
	addEventListener("keydown", handleKeyDown);
	addEventListener("keyup", handleKeyUp);

	addEventListener("mousedown", (e) => {
		keys.click = true;
	});
	addEventListener("mouseup", (e) => {
		keys.click = false;
	});
	playernameInput = document.getElementById("playernameinput");
	let newgamebutton = document.getElementById("newgame");

	playernameInput.addEventListener("input", function () {
		newgame.disabled = playernameInput.value.trim() === "";
	});

	newgamebutton.addEventListener("click", function () {
		if (playernameInput.value.trim() !== "" && !playing) {
			newGame();
			playername = playernameInput.value.trim();
		}
	});

	setInterval(animation, 1000 / fps);
};
//función que se repetirá todo el rato
function animation() {
	if (!paused) {
		//esto son como unas marcas de tiempo para que cuando los frames coincidan se ejecute algo
		if (frame === 1) randomSound(newGameSounds);
		//cada 20 segundos spawnea una caja de munición
		if (frame % 1200 === 0) ammoBoxes.push(new Ammo());
		if (frame === 200) music.play();
		if (frame === 333) newWave();

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
		//funciones para actualizar y dibujar
		updateDrawProjectiles();
		updateDrawBlocks();
		updateDrawEnemies();
		updateDrawPlayer();
		updateDrawAmmo();
		drawData();
		frame++;
	}
}
