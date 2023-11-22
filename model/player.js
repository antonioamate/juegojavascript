class Player {
	constructor() {
		this.goDown = false;
		this.goDownTimestamp = 0;
		this.health = 100;
		this.dead = false;
		this.deathTime = 0;
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
			} else if (frame - this.pistol.reloadFrameStamp > 120) {
				this.pistol.currentMagazine = this.pistol.magazineCapacity;
				this.pistol.magazines--;
				this.pistol.reloading = false;
			}
		}
		if (this.uzi.reloading) {
			if (this.currentGun.gunPistol) {
				this.uzi.reloading = false;
			} else if (frame - this.uzi.reloadFrameStamp > 120) {
				this.uzi.currentMagazine = this.uzi.magazineCapacity;
				this.uzi.magazines--;
				this.uzi.reloading = false;
			}
		}

		//en el momento en el que lo matan estaba vivo y es la primera vez que se muere
		//si está muerto no se puede morir más y se guarda la hora de la defunción
		//el frame se pone a 0
		if (!this.dead && this.health <= 0) {
			music.pause();
			this.animation = 8;
			this.dead = true;
			this.deathTime = frame;
			this.frame = 0;
			randomSound(playerDeathSounds);
		} else if (this.dead) {
			this.nextFrameDead();

			if (frame - this.deathTime > 600) {
				updateRecords();
				paused = true;
				playing = false;
			}
		} else {
			if (frame % 60 === 0) this.health++;
			if (this.health > 100) this.health = 100;
			this.updateCanShoot();
			this.nextFrameGun();
			this.nextAnimationFrame();

			this.checkInput();
			this.speed.y += gravity;

			checkPlayerCollisions();

			//actualizar posición
			this.y += this.speed.y;
			this.x += this.speed.x;

			this.getArmPistolDimensions();
		}
	}

	checkInput() {
    
		if (this.pistol.currentMagazine > 0 && this.pistol.canShoot && keys.click && this.currentGun.gunPistol) {
			this.shoot("0");
		}else if(this.pistol.currentMagazine===0){
      this.reloadPistol()
    }
		if (this.uzi.currentMagazine > 0 && this.uzi.canShoot && keys.click && !this.currentGun.gunPistol) {
			this.shoot("1");
		}else if (this.uzi.currentMagazine===0){
      this.reloadUzi()
    }
		this.facingRight = this.aim.x < this.x + 22 ? false : true;
		this.facingRight ? this.animationIdleRight() : this.animationIdleLeft();
		if (keys.a) {
			this.speed.x -= this.acceleration;
			this.facingRight ? this.animationBackLeft() : this.animationWalkLeft();
		}
		if (keys.d) {
			this.speed.x += this.acceleration;
			this.facingRight ? this.animationWalkRight() : this.animationBackRight();
		}
		if (keys.s) {
			this.speed.x = 0;
			this.facingRight ? this.animationCoverRight() : this.animationCoverLeft();
			this.goDown = true;
		} else {
			this.goDown = false;
		}

		if (keys.w) {
			if (this.animation == 4) {
				this.animation = 3;
			} else if (this.animation == 5) {
				this.animation = 2;
			}
			this.jump();
		}
	}

	nextFrameGun() {
		if (this.pistol.shooting) {
			if (this.pistol.frame > 9) {
				//si ha terminado de disparar se para la animación
				this.pistol.frame = 0;
				this.pistol.shooting = false;
			} else {
				this.pistol.frame++;
			}
		}
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
	updateCanShoot() {
		if (frame - this.pistol.lastShotTime > this.pistol.shotCoolDown) this.pistol.canShoot = true;
		if (frame - this.uzi.lastShotTime > this.uzi.shotCoolDown) this.uzi.canShoot = true;
	}
	draw() {
		this.drawPlayer();
		if (!this.dead) {
			this.drawArm();
			if (this.currentGun.gunPistol) {
				this.drawPistol();
			} else {
				this.drawUzi();
			}
		}
	}
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
	shoot(gun) {
		if (gun === "0") {
			this.pistol.currentMagazine--;
			this.pistol.canShoot = false;
			this.pistol.shooting = true;
      this.pistol.reloading=false
			this.pistol.lastShotTime = frame;
			const audio = new Audio("./sounds/pistolShotCut.mp3");
			audio.play();
		} else {
      this.uzi.currentMagazine--;
			this.uzi.canShoot = false;
			this.uzi.shooting = true;
      this.uzi.reloading=false
			this.uzi.lastShotTime = frame;
			const audio = new Audio("./sounds/uzi.mp3");
			audio.play();
		}

		const projectile = new Projectile({
			x: this.currentGun.x,
			y: this.currentGun.y,
			target: {
				x: this.aim.x,
				y: this.aim.y,
			},
			angle: this.currentGun.angle,
			damage: this.currentGun.gunPistol ? this.pistol.damage : this.uzi.damage,
			gunPistol: this.currentGun.gunPistol,
		});
		let recoil = this.currentGun.gunPistol ? this.pistol.recoil : this.uzi.recoil;
		this.currentGun.recoilAngle += recoil;

		projectiles.push(projectile);
	}
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
		// Calcula la posición del hombro y la posición de la culata a partir del offset, el frame,
		// las coordenadas del ratón y la posición del jugador
		//reducir el recoil hasta 0 poco a poco
		if (Math.abs(this.currentGun.recoilAngle) > 0.01) {
			this.currentGun.recoilAngle *= 0.9;
		} else {
			this.currentGun.recoilAngle = 0;
		}

		// Calcular posición del hombro
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
		if (this.onGround) {
			this.speed.y -= this.jumpStrength;
			randomSound(jumpSounds);
			this.onGround = false;
		}
	}
	nextFrameDead() {
		if (frame % 8 === 0) {
			if (this.frame >= 7) {
				this.frame = 7;
			} else {
				this.frame++;
			}
		}
	}
	nextAnimationFrame() {
		if (frame % 5 === 0) {
			if (this.frame < 7) {
				this.frame++;
			} else {
				this.frame = 0;
			}
		}
	}
	drawPlayer() {
		//ctx.fillStyle = "rgba(255, 0, 0,0.2)";
		//ctx.fillRect(this.x, this.y, 40, 125);
		ctx.drawImage(this.image, this.frame * 100 + 30, this.animation * 125, 40, 125, this.x, this.y, 40, 125);
	}
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
		//dibujar la pistola
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
			-60 / 2 - 10, //posición donde situar la pistola
			-40 / 2 + 6,
			60, //dimensiones de la imagen final
			40
		);
		// Restablecer el contexto al estado guardado
		ctx.restore();
	}
}
