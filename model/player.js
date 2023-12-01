class Player {
	constructor() {
		this.goDown = false;
		this.goDownTimestamp = 0;
		this.health = 100;
		this.dead = false;
		this.deathTime = 0;
		//arma actual con datos comunes de las dos armas y qué arma tenemso equipada
		this.currentGun = {
			recoilAngle: 0,
			gunPistol: false,
			angle: 0,
			x: 300,
			y: 300,
			shoulderDistance: 45,
			aimDistance: 0,
			facingRight: true,
		};
		//datos especificos de la pistola, como los cargadores que tenemos, la capacidad del cargador, el cargador actual, si puede disparar, la imagen, si está disparando, el cooldown por disparo, el daño etc
		this.pistol = {
			magazines: 5,
			magazineCapacity: 12,
			currentMagazine: 12,
			reloadFrameStamp: 0,
			reloading: false,
			recoil: 0.4,
			canShoot: true,
			image: new Image(),
			width: 80,
			height: 48,
			frame: 0,
			shooting: false,
			lastShotTime: 0,
			shotCoolDown: 15,
			damage: 80,
		};
		//datos específicos de la uzi
		this.uzi = {
			magazines: 5,
			magazineCapacity: 50,
			currentMagazine: 50,
			reloadFrameStamp: 0,
			reloading: false,
			recoil: 0.05,
			canShoot: true,
			image: new Image(),
			width: 60,
			height: 40,
			frame: 0,
			shooting: false,
			lastShotTime: 0,
			shotCoolDown: 2,
			damage: 10,
		};
		this.pistol.image.src = "./img/pistol.png";
		this.uzi.image.src = "./img/uzi.png";
		this.image = new Image();
		this.image.src = "./img/spritestick.png";
		this.speed = {
			x: 0,
			y: 0,
		};
		this.x = 50;
		this.y = -250;
		this.width = 40;
		this.height = 125;
		this.acceleration = 5;
		this.jumpStrength = 12;
		this.animation = 2;
		this.covered = false;
		this.onGround = false;
		this.facingRight = true;

		this.aim = {
			x: 1000,
			y: 400,
		};
		this.arm = {
			length: 48,
			start: {
				x: 0,
				y: 0,
			},
			end: {
				x: 0,
				y: 0,
			},
			width: 3.5,
			offset: {
				x: 0,
				y: 0,
			},
			angle: 0,
		};
	}

	update() {
		if (this.health < 0) this.health = 0;
		this.speed.x = 0;

		if (this.pistol.reloading) {
			if (!this.currentGun.gunPistol) {
				this.pistol.reloading = false;
			} else if (frame - this.pistol.reloadFrameStamp > 60) {
				this.pistol.currentMagazine = this.pistol.magazineCapacity;
				this.pistol.magazines--;
				this.pistol.reloading = false;
			}
		}
		if (this.uzi.reloading) {
			if (this.currentGun.gunPistol) {
				this.uzi.reloading = false;
			} else if (frame - this.uzi.reloadFrameStamp > 60) {
				this.uzi.currentMagazine = this.uzi.magazineCapacity;
				this.uzi.magazines--;
				this.uzi.reloading = false;
			}
		}

		//saber si estamos muertos vivos o nos acaban de matar
		// se guarda la hora de la defunción
		//el frame se pone a 0
		if (!this.dead && this.health <= 0) {
			//la música se para para que no interfiera con el sonido de muerte del jugador, que puede que tenga música también
			music.pause();
			//cambiar la animación a animación de muerte
			this.animation = 8;
			this.dead = true;
			this.deathTime = frame;
			this.frame = 0;
			//sonido de muerte del jugador aleatorio
			randomSound(playerDeathSounds);
		} else if (this.dead) {
			this.nextFrameDead();
			//despues de que nos maten esperamos 10 segundos antes de mostrar los records
			if (frame - this.deathTime > 600) {
				updateRecords();
				paused = true;
				playing = false;
			}
		} else {
			//si estamos vivos cada segundo se nos añade un 1% de vida
			if (frame % 60 === 0) this.health++;
			//controlar que la vida no supere el 100
			if (this.health > 100) this.health = 100;
			//actualizar si podemos disparar, el fotograma del arma y la animación del jugador
			this.updateCanShoot();
			this.nextFrameGun();
			this.nextAnimationFrame();
			//comprobar el input
			this.checkInput();
			//aplicar la gravedad
			this.speed.y += gravity;
			//comprobar las colisiones del jugador
			checkPlayerCollisions();

			//actualizar posición
			this.y += this.speed.y;
			this.x += this.speed.x;
			//hacer los calculos para obtener la posición del brazo y del arma
			this.getArmPistolDimensions();
		}
	}

	checkInput() {
		//si tenemos balas y la pistola puede disparar y hacemos click la pistola dispara
		if (this.pistol.currentMagazine > 0 && this.pistol.canShoot && keys.click && this.currentGun.gunPistol) {
			this.shoot("0");
			//si no tenemos balas llamamos a reloadPistol
		} else if (this.pistol.currentMagazine === 0) {
			this.reloadPistol();
		}
		//lo mismo con la uzi
		if (this.uzi.currentMagazine > 0 && this.uzi.canShoot && keys.click && !this.currentGun.gunPistol) {
			this.shoot("1");
		} else if (this.uzi.currentMagazine === 0) {
			this.reloadUzi();
		}
		//saber hacia donde está mirando el jugador basandose en la mira y la posición del jugador
		this.facingRight = this.aim.x < this.x + 22 ? false : true;
		//si está mirando a la derecha de primeras se pone al jugador a mirar hacia la derecha en posicion parada
		this.facingRight ? this.animationIdleRight() : this.animationIdleLeft();
		//si se pulsa la tecla a el jugador se mueve a la izquierda
		if (keys.a) {
			this.speed.x -= this.acceleration;
			//dependiendo de hacia donde esté mirando el jugador nos movemos hacia alante o hacia atras
			this.facingRight ? this.animationBackLeft() : this.animationWalkLeft();
		}
		//lo mismo para la derecha
		if (keys.d) {
			this.speed.x += this.acceleration;
			this.facingRight ? this.animationWalkRight() : this.animationBackRight();
		}
		//si se pulsa la tecla s la velocida x se pone a 0 y se cambia a la animación agachado
		if (keys.s) {
			this.speed.x = 0;
			this.facingRight ? this.animationCoverRight() : this.animationCoverLeft();
			//pongo goDown a true para que pueda bajar de las plataformas
			this.goDown = true;
		} else {
			this.goDown = false;
		}
		//si se pulsa w se cambia la animación en el caso de que esté agachado y se llama a la función jump
		if (keys.w) {
			if (this.animation == 4) {
				this.animation = 3;
			} else if (this.animation == 5) {
				this.animation = 2;
			}
			this.jump();
		}
	}
	//siguiente fotograma de la animación del arma
	nextFrameGun() {
		//si la pistola está en proceso de disparo incrementar la animación, si ya ha terminado la animación de disparo ponerlo a 0 y establecer que la pistola ya no está disparando
		if (this.pistol.shooting) {
			if (this.pistol.frame > 9) {
				//si ha terminado de disparar se para la animación
				this.pistol.frame = 0;
				this.pistol.shooting = false;
			} else {
				this.pistol.frame++;
			}
		}
		//lo mismo para la uzi
		if (this.uzi.shooting) {
			if (this.uzi.frame > 9) {
				//si ha terminado de disparar se para la animación
				this.uzi.frame = 0;
				this.uzi.shooting = false;
			} else {
				this.uzi.frame++;
			}
		}
	}
	//se mide si ha pasado el tiempo suficiendo para que podamos volver a disparar
	updateCanShoot() {
		if (frame - this.pistol.lastShotTime > this.pistol.shotCoolDown) this.pistol.canShoot = true;
		if (frame - this.uzi.lastShotTime > this.uzi.shotCoolDown) this.uzi.canShoot = true;
	}
	//dibujar al jugador
	draw() {
		this.drawPlayer();
		if (!this.dead) {
			//solo se dibujan el brazo y la pistola si está vivo
			this.drawArm();
			if (this.currentGun.gunPistol) {
				this.drawPistol();
			} else {
				this.drawUzi();
			}
		}
	}
	//cambiar la animación del jugador y el offset del hombro según la animación
	animationWalkLeft() {
		this.animation = 0;
		this.updateArmOffset({ x: 20, y: 28 });
	}
	animationWalkRight() {
		this.animation = 1;
		this.updateArmOffset({ x: 20, y: 28 });
	}
	animationIdleRight() {
		this.animation = 2;
		this.updateArmOffset({ x: 20, y: 28 });
	}
	animationIdleLeft() {
		this.animation = 3;
		this.updateArmOffset({ x: 20, y: 28 });
	}
	animationCoverLeft() {
		this.animation = 4;
		this.updateArmOffset({ x: 22, y: 64 });
	}
	animationCoverRight() {
		this.animation = 5;
		this.updateArmOffset({ x: 16, y: 64 });
	}
	animationBackLeft() {
		this.animation = 6;
		this.updateArmOffset({ x: 20, y: 28 });
	}
	animationBackRight() {
		this.animation = 7;
		this.updateArmOffset({ x: 20, y: 28 });
	}
	updateArmOffset(offset = { x, y }) {
		this.arm.offset.x = offset.x;
		this.arm.offset.y = offset.y;
	}
	//función disparar
	shoot(gun) {
		//si tenemos equipada la pistola se dispara con la pistola
		if (gun === "0") {
			//se quita una bala del cargador
			this.pistol.currentMagazine--;
			//ponemos que la pistola no puede disparar y que se encuentra disparando
			this.pistol.canShoot = false;
			this.pistol.shooting = true;
			//pongo reloading a false porque en el caso de que esté recargando y dispare quiero que se interrumpa la recarga
			this.pistol.reloading = false;
			//se guarda el fotograma del disparo
			this.pistol.lastShotTime = frame;
			//reproducir sonido del disparo
			const audio = new Audio("./sounds/pistolShotCut.mp3");
			audio.play();
			//lo mismo para la uzi
		} else {
			this.uzi.currentMagazine--;
			this.uzi.canShoot = false;
			this.uzi.shooting = true;
			this.uzi.reloading = false;
			this.uzi.lastShotTime = frame;
			const audio = new Audio("./sounds/uzi.mp3");
			audio.play();
		}
		//se tiene que añadir un nuevo proyectil
		const projectile = new Projectile({
			//la posición inicial del proyectil será la posición del arma actual
			x: this.currentGun.x,
			y: this.currentGun.y,
			//el objetivo será la mira
			target: {
				x: this.aim.x,
				y: this.aim.y,
			},
			//el angulo del proyectil se obtiene del arma actual
			angle: this.currentGun.angle,
			//dependiendo de qué arma tengamos equipada hará un daño u otro
			damage: this.currentGun.gunPistol ? this.pistol.damage : this.uzi.damage,
			//pasarle qué arma ha realizado el disparo
			gunPistol: this.currentGun.gunPistol,
		});
		// obtener retroceso dependiendo de si es la pistola o la uzi
		let recoil = this.currentGun.gunPistol ? this.pistol.recoil : this.uzi.recoil;
		//añadir retroceso al angulo de retroceso
		this.currentGun.recoilAngle += recoil;
		//añadir el proyectil al array de proyectiles
		projectiles.push(projectile);
	}
	//recargar pistola
	reloadPistol() {
		//si tengo cargadores y el cargador actual no está lleno y no está recargando
		if (this.pistol.magazines > 0 && this.pistol.currentMagazine < this.pistol.magazineCapacity && !this.pistol.reloading) {
			//se guarda el frame donde se ha empezado a recargar y se pone reloading a true
			this.pistol.reloadFrameStamp = frame;
			this.pistol.reloading = true;
		}
	}

	reloadUzi() {
		if (this.uzi.magazines > 0 && this.uzi.currentMagazine < this.uzi.magazineCapacity && !this.uzi.reloading) {
			this.uzi.reloadFrameStamp = frame;
			this.uzi.reloading = true;
		}
	}
	getArmPistolDimensions() {
		// Calcula la posición del hombro y la posición de la culata a partir del offset, el frame, el angulo de retroceso, las coordenadas del ratón y la posición del jugador
		//reducir el recoil hasta 0
		if (Math.abs(this.currentGun.recoilAngle) > 0.01) {
			this.currentGun.recoilAngle *= 0.9;
		} else {
			this.currentGun.recoilAngle = 0;
		}

		// Calcular posición del hombro según el fotograma para seguir el movimiento de la respiración
		if (this.frame < 5) {
			this.arm.start.y = this.y + this.arm.offset.y + this.frame;
		} else {
			this.arm.start.y = this.y + this.arm.offset.y + 8 - this.frame;
		}
		this.arm.start.x = this.x + this.arm.offset.x;

		// Calcular vector entre la mira y el hombro
		let dx = this.aim.x - this.arm.start.x;
		let dy = this.aim.y - this.arm.start.y;

		// Calcular distancia entre el hombro y la mira
		this.currentGun.aimDistance = Math.sqrt(dx * dx + dy * dy);
		//normalizar el vector hombro mira
		let normalizedDx = dx / this.currentGun.aimDistance;
		let normalizedDy = dy / this.currentGun.aimDistance;
		let auxRecoil;
		//el angulo de retroceso será positivo o negativo según a donde estemos mirando
		if (this.facingRight) {
			auxRecoil = -Math.abs(this.currentGun.recoilAngle);
		} else {
			auxRecoil = Math.abs(this.currentGun.recoilAngle);
		}
		// calcular el vector de la pistola rotando el vector mira hombro
		let rotatedDX = normalizedDx * Math.cos(auxRecoil) - normalizedDy * Math.sin(auxRecoil);
		let rotatedDY = normalizedDx * Math.sin(auxRecoil) + normalizedDy * Math.cos(auxRecoil);

		// Posición de la pistola con el vector rotado
		this.currentGun.x = this.arm.start.x + rotatedDX * this.currentGun.shoulderDistance;
		this.currentGun.y = this.arm.start.y + rotatedDY * this.currentGun.shoulderDistance;

		// Ángulo de la pistola con el vector rotado
		this.currentGun.angle = Math.atan2(rotatedDY, rotatedDX);

		// Ajustar el brazo según donde mire el jugador
		let armRotation = this.facingRight ? 0.16 : -0.16;

		// Rotar el vector del brazo 0.16

		let armDX = rotatedDX * Math.cos(armRotation) - rotatedDY * Math.sin(armRotation);
		let armDY = rotatedDX * Math.sin(armRotation) + rotatedDY * Math.cos(armRotation);

		// Calcular la posición final del brazo
		this.arm.end.x = this.arm.start.x + armDX * this.arm.length;
		this.arm.end.y = this.arm.start.y + armDY * this.arm.length;
	}
	jump() {
		//saltar solo si el jugador está en el suelo o una plataforma
		if (this.onGround) {
			this.speed.y -= this.jumpStrength;
			randomSound(jumpSounds);
			this.onGround = false;
		}
	}
	//pasar al siguiente fotograma de la animación de muerte y dejarlo en el final cuando acabe
	nextFrameDead() {
		if (frame % 8 === 0) {
			if (this.frame >= 7) {
				this.frame = 7;
			} else {
				this.frame++;
			}
		}
	}
	//siguiente fotograma de la animación del jugador
	nextAnimationFrame() {
		//ponerle un tiempo de espera de 5 fotogramas del juego entre fotograma y fotograma de la animación para que vaya más lenta
		if (frame % 5 === 0) {
			if (this.frame < 7) {
				this.frame++;
			} else {
				this.frame = 0;
			}
		}
	}
	drawPlayer() {
		//dibujar al jugador
		ctx.drawImage(this.image, this.frame * 100 + 30, this.animation * 125, 40, 125, this.x, this.y, 40, 125);
	}
	// el brazo es una línea
	drawArm() {
		//dibujar el brazo
		ctx.lineWidth = this.arm.width;
		ctx.lineCap = "round";
		ctx.beginPath();
		ctx.moveTo(this.arm.start.x, this.arm.start.y);
		ctx.lineTo(this.arm.end.x, this.arm.end.y);
		ctx.stroke();
	}
	drawPistol() {
		//dibujar la pistola
		ctx.save();
		ctx.translate(this.currentGun.x, this.currentGun.y);
		ctx.rotate(this.currentGun.angle);
		if (!this.facingRight) ctx.scale(1, -1); // Reflejar horizontalmente
		ctx.drawImage(
			this.pistol.image,
			80 * this.pistol.frame, //inicio x
			0, //inicio y
			80, //cuanto cortar de la imagen
			48,
			-80 / 2 + 11, //posición donde situar la pistola
			-48 / 2 + 11,
			80, //dimensiones de la imagen final
			48
		);
		// Restablecer el contexto al estado guardado
		ctx.restore();
	}
	drawUzi() {
		//dibujar la uzi
		ctx.save();
		ctx.translate(this.currentGun.x, this.currentGun.y);
		ctx.rotate(this.currentGun.angle);
		if (this.facingRight) {
			ctx.scale(-1, 1);
		} else {
			ctx.scale(-1, -1);
		} // Reflejar horizontalmente
		ctx.drawImage(
			this.uzi.image,
			0, //inicio x
			40 * this.uzi.frame, //inicio y
			60, //cuanto cortar de la imagen
			40,
			-60 / 2 - 10, //posición donde situar la uzi
			-40 / 2 + 6,
			60, //dimensiones de la imagen final
			40
		);
		// restablecer el contexto al estado guardado
		ctx.restore();
	}
}
