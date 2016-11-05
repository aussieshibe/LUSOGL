var perspectiveMatrix;

class GameTimer {

	constructor () {
		this.tickLength = Math.floor(1000/240.0);
		this.lastTick = 0;
		this.lastRender = 0;
		this.updatables = [];
		this.drawables = [];
	}

	get nextTick() {
		this.lastTick + this.tickLength;
	}

	numTicks(tFrame) {
		return Math.floor(this.timeSinceLastTick(tFrame) / this.tickLength);
	}

	timeSinceLastTick(tFrame) {
		return tFrame - this.lastTick;
	}

	init() {
		this.lastTick = performance.now();
		this.lastRender = performance.now();
	}

	run(tFrame) {
		//console.log("Number of ticks to process before render: " + this.numTicks(tFrame));
		this.queueUpdates(this.numTicks(tFrame));
		this.render(tFrame);
		this.lastRender = tFrame;
		statMon.drawScene(tFrame);
	}

	queueUpdates(numTicks) {
		for(var i=0; i < numTicks; i++) {
			this.lastTick = this.lastTick + this.tickLength;
			this.update(this.tickLength);
		}
	}

	update(deltaT) {
		for (var i in this.updatables) {
			this.updatables[i].update(deltaT);
		}
	}

	render(deltaT) {
		/**
		 * Do some setup, clear the screen, setup view matrix, etc
		 */
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);
		loadIdentity();
		multMatrix(camera.viewMatrix);

		// Render each drawable object
		for(var i in this.drawables) {
			this.drawables[i].draw(gl);
		}
	}

	addUpdatable(o) {
		if(typeof o.update === 'function') {
			this.updatables.push(o);
		} else {
			throw "Object added to updatables has no update function.";
		}
	}

	addDrawable(o) {
		if(typeof o.draw === 'function') {
			this.drawables.push(o);
		} else {
			throw "Object added to drawables has no draw function.";
		}
	}
}