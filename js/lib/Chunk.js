class Chunk {

	static get SIZE() {
		return 4;
	}

	static get CUBECOUNT() {
		return Math.pow(Chunk.SIZE, 3);
	}

	static CUBECOORDSFROMINDEX(i) {
		var result = [];
		result[0] = Math.floor(i/(Math.pow(Chunk.SIZE, 2)));
		i -= result[0] * Math.pow(Chunk.SIZE, 2);
		result[1] = Math.floor(i/Chunk.SIZE);
		i-= result[1] * Chunk.SIZE;
		result[2] = i;
		return result;
	}

	constructor() {

		/**
		 * Cubes are stored in a 1d array cube at x,y,z position can be
		 *  found with i = (z * Math.pow(Chunk.SIZE, 2)) + (y * Chunk.SIZE) + x
		 */
		this.cubes = new Array(Chunk.CUBECOUNT);

		// Generate some cubes to fill the chunk
		for (var i = Chunk.CUBECOUNT - 1; i >= 0; i--) {
			this.cubes[i] = new Cube(Chunk.CUBECOORDSFROMINDEX(i));
		}
	}

	draw(gl) {
		for (var i = Chunk.CUBECOUNT - 1; i >= 0; i--) {
			mvPushMatrix();
			this.cubes[i].draw(gl);
			mvPopMatrix();
		}
	}

	update(deltaT) {
		for (var i = Chunk.CUBECOUNT - 1; i >= 0; i--) {
			this.cubes[i].update(deltaT);
		}
	}

	/**
	 * Init all cubes
	 */
	init(gl) {
		for (var i = Chunk.CUBECOUNT - 1; i >= 0; i--) {
			this.cubes[i].init(gl);
		}
	}
}