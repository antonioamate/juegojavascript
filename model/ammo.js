class Ammo {
	constructor() {
		//las cajas de munición aparecen aleatoriamente
		this.x = randomNumber(100, 1000);
		this.y = randomNumber(100, 400);
		this.angle = 0;
		this.image = new Image();
		this.image.src = "./img/ammo.png";
		this.height = 52;
		this.width = 73;
	}
	update() {
		//las cajas de munición girarán sobre su centro
		this.angle += 0.02;
	}
	draw() {
		ctx.save();
		ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		ctx.rotate(this.angle);
		ctx.drawImage(
			this.image,
			0, //inicio x
			0, //inicio y
			this.width, //cuanto cortar de la imagen
			this.height,
			-this.width / 2, //posición donde situar la pistola
			-this.height / 2,
			this.width, //dimensiones de la imagen final
			this.height
		);
		ctx.restore();
	}
}
