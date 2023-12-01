class Enemy {
	constructor() {
		this.scale=randomNumber(0.5,3)
		this.goDown = false;
		this.goDownTimestamp = 0;
		this.lastJumpFrameStamp = 0;
		this.beggingAudio;
		this.agressive = true;
		this.lastBite = 0;
		this.health = 100 * this.scale;
		this.dead = false;
		this.deathTime = 0;
		this.limitPain = randomNumber(10, 90) * this.scale;
		this.x = randomNumber(200, 1000);
		this.y = 100;
		this.width = 60 * this.scale;
		this.height = 125 * this.scale;
		this.damage=20*this.scale
		this.image = new Image();
		this.image.src = "./img/spriteenemy.png";
		this.speed = {
			x: 0,
			y: 0,
		};
		this.acceleration = 1/this.scale
		this.animation = 0;
		this.frame = 0;
		this.onGround = true;
		this.frameCooldown = 8 * this.scale;
	}

	draw() {
		ctx.drawImage(
			this.image,
			this.frame * 100 + 20, //por donde empieza a recortar la imagen
			this.animation * 125,
			60, //lo que recorta de la imagen fuente
			125,
			this.x, //donde pone la imagen
			this.y,
			this.width, //dimensiones de la imagen a dibujar (dejarlo igual)
			this.height
		);
	}

	update() {
		//al principio del update se pone la velocidad x a 0 para que no acelere infinitamente
		this.speed.x = 0;
		//si han recibido más daño del que pueden soportar y están agresivos cambiar su comportamiento
		if (this.health <= this.limitPain && this.agressive) {
			this.agressive = false;
			//al estar asustados corren más y las piernas se mueven más rápido
			this.acceleration = 3;
			this.frameCooldown = 2;
			//reproducir sonidos donde suplican por su vida y recoger el objeto audio para pararlo si los matamos
			this.beggingAudio = randomSound(beggingSounds);
		}
		//condicional para saber si el enemigo se está muriendo, si está muerto o vivo
		if (!this.dead && this.health <= 0) {
			this.animation = 2;
			this.dead = true;
			this.deathTime = frame;
			this.frame = 0;
			killCount++;
			randomSound(enemyDeathSounds);
		} else if (this.dead) {
			//cuando matamos al enemigo el sonido de los gritos se para
			this.beggingAudio.pause();
			this.nextFrameDead();

			if (frame - this.deathTime > 400) {
				//aquí tiene que desaparecer el cadaver despues de un tiempo
				removeEnemy(this);
			}
		} else {
			//se reproducen sonidos del enemigo aleatoriamente
			if (frame % (Math.floor(Math.random() * 1500) + 120) === 0) {
				randomSound(angryEnemySounds);
			}
			this.nextAnimationFrame();
			//si está agresivo corre hacia ti
			if (this.agressive) {
				if (player.x + 30 < this.x) {
					this.speed.x -= this.acceleration;
					this.animation = 0;
				} else if (player.x - 30 > this.x) {
					this.speed.x += this.acceleration;
					this.animation = 1;
				}
				//si está por debajo del jugador salta
				if (this.y > player.y + 10) {
					this.jump();
				}
				//si está por encima se activa el goDown permitiendole atravesar las plataformas desde arriba para que pueda bajar a por nosotros
				if (this.y < player.y - 10) {
					this.goDown = true;
				} else {
					this.goDown = false;
				}
			} else {
				//huir del jugador
				if (player.x < this.x) {
					this.speed.x += this.acceleration;
					this.animation = 1;
				} else if (player.x > this.x) {
					this.speed.x -= this.acceleration;
					this.animation = 0;
				}
			}
			//aplicar gravedad y comprobar colisoines
			this.speed.y += gravity
			checkEnemyCollisions(this);

			//actualizar posición
			this.y += this.speed.y 
			this.x += this.speed.x;
		}
	}
	jump() {
		//los saltos tienen un cooldown de 5 segundos a 10 segundos
		if (this.onGround && frame - this.lastJumpFrameStamp > randomNumber(600, 1800) * this.scale) {
			//cada vez saltan con una fuerza aleatoria
			this.speed.y -= randomNumber(10, 15) * this.scale;
			//onground a false para que no puedan volver a saltar en el aire
			this.onGround = false;
			this.lastJumpFrameStamp = frame;
		}
	}
	//cambiar el fotograma de la animación del enemigo
	nextAnimationFrame() {
		//cooldown para que solo se incremente el fotograma si han pasado x fotogramas del juego y que la animación sea más lenta
		if (frame % this.frameCooldown === 0) {
			if (this.frame < 7) {
				this.frame++;
			} else {
				this.frame = 0;
			}
		}
	}
	//cambiar el fotograma de la animación de muerte al siguiente pero no volver al primer fotograma y que se quede el último fotograma con la calavera
	nextFrameDead() {
		if (frame % 8 === 0) {
			if (this.frame >= 7) {
				this.frame = 7;
			} else {
				this.frame++;
			}
		}
	}
}
