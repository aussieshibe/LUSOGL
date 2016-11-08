class Cube {

	constructor(position) {
		this.model = {
			'vertices' : [
				// Front face
				-0.5, -0.5,  0.5,
				0.5, -0.5,  0.5,
				0.5,  0.5,  0.5,
				-0.5,  0.5,  0.5,

				// Back face
				-0.5, -0.5, -0.5,
				-0.5,  0.5, -0.5,
				0.5,  0.5, -0.5,
				0.5, -0.5, -0.5,

				// Top face
				-0.5,  0.5, -0.5,
				-0.5,  0.5,  0.5,
				0.5,  0.5,  0.5,
				0.5,  0.5, -0.5,

				// Bottom face
				-0.5, -0.5, -0.5,
				0.5, -0.5, -0.5,
				0.5, -0.5,  0.5,
				-0.5, -0.5,  0.5,

				// Right face
				0.5, -0.5, -0.5,
				0.5,  0.5, -0.5,
				0.5,  0.5,  0.5,
				0.5, -0.5,  0.5,

				// Left face
				-0.5, -0.5, -0.5,
				-0.5, -0.5,  0.5,
				-0.5,  0.5,  0.5,
				-0.5,  0.5, -0.5],
			'textureCoordinates' : [
				// Front
				0.0,  0.0,
				1.0,  0.0,
				1.0,  1.0,
				0.0,  1.0,
				// Back
				0.0,  0.0,
				1.0,  0.0,
				1.0,  1.0,
				0.0,  1.0,
				// Top
				0.0,  0.0,
				1.0,  0.0,
				1.0,  1.0,
				0.0,  1.0,
				// Bottom
				0.0,  0.0,
				1.0,  0.0,
				1.0,  1.0,
				0.0,  1.0,
				// Right
				0.0,  0.0,
				1.0,  0.0,
				1.0,  1.0,
				0.0,  1.0,
				// Left
				0.0,  0.0,
				1.0,  0.0,
				1.0,  1.0,
				0.0,  1.0],
			'vertexNormals' : [
				// Front
				0.0,  0.0,  0.5,
				0.0,  0.0,  0.5,
				0.0,  0.0,  0.5,
				0.0,  0.0,  0.5,

				// Back
				0.0,  0.0, -0.5,
				0.0,  0.0, -0.5,
				0.0,  0.0, -0.5,
				0.0,  0.0, -0.5,

				// Top
				0.0,  0.5,  0.0,
				0.0,  0.5,  0.0,
				0.0,  0.5,  0.0,
				0.0,  0.5,  0.0,

				// Bottom
				0.0, -0.5,  0.0,
				0.0, -0.5,  0.0,
				0.0, -0.5,  0.0,
				0.0, -0.5,  0.0,

				// Right
				0.5,  0.0,  0.0,
				0.5,  0.0,  0.0,
				0.5,  0.0,  0.0,
				0.5,  0.0,  0.0,

				// Left
				-0.5,  0.0,  0.0,
				-0.5,  0.0,  0.0,
				-0.5,  0.0,  0.0,
				-0.5,  0.0,  0.0],
			'cubeVertexIndices' : [
				0,  1,  2,      0,  2,  3,    // front
				4,  5,  6,      4,  6,  7,    // back
				8,  9,  10,     8,  10, 11,   // top
				12, 13, 14,     12, 14, 15,   // bottom
				16, 17, 18,     16, 18, 19,   // right
				20, 21, 22,     20, 22, 23]    // left
		}

		this.position = position || [0, 0, 0];
	}

	getVertices() {
		var relativeVertices = [];
		for (var v = 0; v < this.model.vertices.length; v += 3) {
			for(var p = 0; p < 3; p++) {
				relativeVertices.push(this.model.vertices[v+p] + this.position[p]);
			}
		}
		return relativeVertices;
	}

	getTextureCoords() {
		return this.model.textureCoordinates;
	}

	getVertexIndices(vertexOffset) {
		var relativeIndices = [];
		for (var i = 0; i < this.model.cubeVertexIndices.length; i++) {
			relativeIndices.push(this.model.cubeVertexIndices[i] + vertexOffset);
		}
		return relativeIndices;
	}

	getVertexNormals() {
		return this.model.vertexNormals;
	}

	init() {

	}

	update(deltaT) {

	}



}