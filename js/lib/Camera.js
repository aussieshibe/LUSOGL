class Camera {

	static get SPEED () {
		return 30;
	}

	static get MOUSESPEED () {
		return 0.8;
	}

	constructor() {
		this.eye = $V([10, 10, 10]);
		this.center = $V([0, 0, 0]);
		this.up =  $V([0, 1, 0]);

		this.currentlyPressedKeys = {};

		this.mouseMovementListener = (event) => {
			this.mouseMovementHandler(event);
		}
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

	/**
	 * Set the forward direction, accepts a vec3 as the facing direction
	 * relative to the camera
	 */
	set forward(v) {
		this.center = this.eye.add(v);
	}

	get right() {
		return $V([-this.forward.e(3), 0, this.forward.e(1)]);
	}

	init() {
		// Setup callbacks for various inputs
		// Fat-arrow functions bind the scope of the callbacks to the scope of the parent
		document.onkeydown = (event) => this.currentlyPressedKeys[event.key.toLowerCase()] = true;
		document.onkeyup = (event) => this.currentlyPressedKeys[event.key.toLowerCase()] = false;
		canvas.onmousedown = (event) => this.lockCursor();

		document.addEventListener('pointerlockchange', (event) => this.lockChangeListener(), false);
		document.addEventListener('mozpointerlockchange', (event) => this.lockChangeListener(), false);
	}

	update(deltaT) {

		var moveDirection = $V([
			this.currentlyPressedKeys['d'] || 0 - this.currentlyPressedKeys['a'] || 0,
			this.currentlyPressedKeys[' '] || 0 - this.currentlyPressedKeys['c'] || 0,
			this.currentlyPressedKeys['w'] || 0 - this.currentlyPressedKeys['s'] || 0]);
	
		this.relativeTranslate(moveDirection.x(deltaT * Camera.SPEED /1000));

		if (this.currentlyPressedKeys['escape']) {
			this.unlockCursor();
		}
	}

	/**
	 * Accepts a vector, moves the camera relative to it's current facing
	 */
	relativeTranslate(v) {
		var relativeTranslation = (this.right.x(v.e(1)).add(this.up.x(v.e(2))).add(this.forward.x(v.e(3))).x(1.0/3.0));
		this.eye = this.eye.add(relativeTranslation);
		this.center = this.center.add(relativeTranslation);
	}

	lockCursor() {
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
		// Request pointer 
		if(!(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas))
			canvas.requestPointerLock();
	}

	unlockCursor() {
		canvas.exitPointerLock = canvas.exitPointerLock || canvas.mozExitPointerLock;
		if(document.pointerLockElement === canvas || document.mozPointerLockElement === canvas)
			canvas.exitPointerLock();
		// else the pointer is not locked
	}

	lockChangeListener() {
		if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
			console.log('The pointer lock status is now locked');
			document.addEventListener("mousemove", this.mouseMovementListener, false);
		} else {
			console.log('The pointer lock status is now unlocked');  
			document.removeEventListener("mousemove", this.mouseMovementListener, false);
		}
	}

	mouseMovementHandler(event) {
		var mouseX = event.movementX;
		var mouseY = event.movementY;
		this.forward = this.forward.rotate(Math.PI/2/360 * -mouseX * Camera.MOUSESPEED, Line.create(Vector.Zero(3), this.up));
		this.forward = this.forward.rotate(Math.PI/2/360 * -mouseY * Camera.MOUSESPEED, Line.create(Vector.Zero(3), this.right));
	}


}