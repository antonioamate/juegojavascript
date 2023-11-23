class Projectile {
	//constuctor del proyectil, se le pasa la posición, el objetivo, el angulo, el daño del proyectil y si es un proyectil de pistola o no
	constructor({ x, y, target, angle, damage, gunPistol }) {
		this.damage = damage;
		this.x = x;
		this.y = y;
		this.target = {
			x: target.x,
			y: target.y,
		};
		this.speed = 40;
		this.width = 10;
		this.height = 2;
		this.angle = angle;
		this.gunPistol = gunPistol;
	}

	draw() {
		//son amarillos y están rotados por el centro
		ctx.fillStyle = "yellow";
		ctx.save();
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(this.angle);
		ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
		ctx.restore();
	}

	update() {
		//utilizo trigonometría para saber cuanto se deben mover en base al angulo y la velocidad
		this.x += this.speed * Math.cos(this.angle);
		this.y += this.speed * Math.sin(this.angle);

		//comprobar si está colisionando con bloques
		for (const block of blocks) {
			if (isColliding(this, block)) {
				removeProjectile(this);
				console.log("block got shot");
				randomSound(bulletWoodSounds);
				return;
			}
		}
		//comprobar si se ha disparado a un enemigo
		for (const enemy of enemies) {
			//si el enemigo está muerto ignorarlo
			if (!enemy.dead && isColliding(this, enemy)) {
				let actualDamage = 0;
				//si es un proyectil de pistola el que recibe
				if (this.gunPistol) {
					//se mira a qué altura recibe el disparo
					if (this.y < enemy.y + 20) {
						//un disparo en la cabeza quita toda la vida e incrementa el contador de headshots
						actualDamage = 100;
						headshots++;
						console.log("headshot!");
					} else if (this.y < enemy.y + 75) {
						//disparo en el torso
						actualDamage = 80;
					} else {
						//disparo en las piernas
						actualDamage = 5;
					}
				} else {
					//lo mismo con la uzi pero cambiando los valores de daño
					if (this.y < enemy.y + 20) {
						//disparo en la cabeza
						actualDamage = 100;
						headshots++;
						console.log("headshot!");
					} else if (this.y < enemy.y + 75) {
						//disparo en el torso
						actualDamage = 10;
					} else {
						//disparo en las piernas
						actualDamage = 5;
					}
				}
				//quitarle vida al enemigo
				enemy.health -= actualDamage;
				removeProjectile(this);
				console.log("enemy got shot");
				randomSound(enemyHitSounds);
				return;
			}
		}
	}
}
