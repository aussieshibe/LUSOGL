class Camera {

	static get SPEED () {
		return 10;
	}

	constructor() {
		this.eye = $V([10, 10, 10]);
		this.center = $V([0, 0, 0]);
		this.up =  $V([0, 1, 0]);

		this.currentlyPressedKeys = {};
	}

	get viewMatrix() {
		var z = this.eye.subtract(this.center).toUnitVector();
		var x = this.up.cross(z).toUnitVector();
		var y = z.cross(x).toUnitVector();

		var m = $M([[x.e(1), x.e(2), x.e(3), 0],
		            [y.e(1), y.e(2), y.e(3), 0],
		            [z.e(1), z.e(2), z.e(3), 0],
		            [0, 0, 0, 1]]);

		var t = $M([[1, 0, 0, -this.eye.e(1)],
		            [0, 1, 0, -this.eye.e(2)],
		            [0, 0, 1, -this.eye.e(3)],
		            [0, 0, 0, 1]]);
		return m.x(t);
	}

	get forward() {
		return (this.center.subtract(this.eye)).toUnitVector();
	}

	get right() {
		return $V([-this.forward.e(3), 0, this.forward.e(1)]);
	}

	init() {
		var self = this;
		document.onkeydown = (event) => this.currentlyPressedKeys[event.key.toLowerCase()] = true;
		document.onkeyup = (event) => this.currentlyPressedKeys[event.key.toLowerCase()] = false;
	}

	update(deltaT) {

		var moveDirection = $V([
			this.currentlyPressedKeys['d'] || 0 - this.currentlyPressedKeys['a'] || 0,
			this.currentlyPressedKeys[' '] || 0 - this.currentlyPressedKeys['c'] || 0,
			this.currentlyPressedKeys['w'] || 0 - this.currentlyPressedKeys['s'] || 0]);

		console.log(moveDirection);
		
		this.relativeTranslate(moveDirection.x(deltaT * Camera.SPEED /1000));
	}

	/**
	 * Accepts a vector, moves the camera relative to it's current facing
	 */
	relativeTranslate(v) {
		var relativeTranslation = (this.right.x(v.e(1)).add(this.up.x(v.e(2))).add(this.forward.x(v.e(3))).x(1.0/3.0));
		this.eye = this.eye.add(relativeTranslation);
		this.center = this.center.add(relativeTranslation);
		console.log(this);
	}


}