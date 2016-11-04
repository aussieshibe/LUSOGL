class Cube {

	constructor() {
		this.buffer = {
			'vertices' : '',
			'verticesTextureCoord' : '',
			'verticesIndex' : '',
			'verticesNormal' : ''
		};

		this.attribute = {
			'vertexPosition' : '',
			'textureCoord' : '',
			'vertexNormal' : ''
		};

		this.rotation = Math.random() * 360;

		this.position = [(5 * Math.random()) - 2.5, (5 * Math.random()) - 2.5, (5 * Math.random()) - 2.5];
		//this.rotVector = [Math.random(), Math.random(), Math.random()]; // Rotate in a random direction
		this.rotVector = this.position; // Rotate relative to position
		this.velocity = [Math.random(), Math.random(), Math.random()];


		this.id = Math.random();

		this.shaderProgram;
		this.cubeTexture;
	}

	update(deltaT) {

		this.rotation += (30 * deltaT) / 1000.0;

		vec3.scaleAndAdd(this.position, this.position, this.velocity, (3 * deltaT) / 1000.0);

		for (i in this.position) {
			if (Math.abs(this.position[i]) > 5)
				this.velocity[i] = -this.velocity[i];
		}

	}

	draw(gl) {

		gl.useProgram(this.shaderProgram);

		mvTranslate(this.position);
		mvRotate(this.rotation, this.rotVector);
		
		// Draw cube: bind array buffer to cube vertices array, set attrs, push to gl
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.vertices);
		gl.vertexAttribPointer(this.attribute.vertexPosition, 3, gl.FLOAT, false, 0, 0);

		// Set texture coordinates attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.verticesTextureCoord);
		gl.vertexAttribPointer(this.attribute.textureCoord, 2, gl.FLOAT, false, 0, 0);

		// Set texture
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.cubeTexture);
		gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);

		// Bind normals to shared attribute
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.verticesNormal);
		gl.vertexAttribPointer(this.attribute.vertexNormal, 3, gl.FLOAT, false, 0, 0);

		// Draw the cube
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.verticesIndex);
		setMatrixUniforms(gl, this.shaderProgram);
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
	}

	init(gl) {
		this.initShaders(gl);
		this.initBuffers(gl);
		this.initTextures(gl);
	}

	initBuffers(gl) {
		this.buffer.vertices = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.vertices);

		var vertices = [
		  // Front face
		  -1.0, -1.0,  1.0,
		   1.0, -1.0,  1.0,
		   1.0,  1.0,  1.0,
		  -1.0,  1.0,  1.0,
		  
		  // Back face
		  -1.0, -1.0, -1.0,
		  -1.0,  1.0, -1.0,
		   1.0,  1.0, -1.0,
		   1.0, -1.0, -1.0,
		  
		  // Top face
		  -1.0,  1.0, -1.0,
		  -1.0,  1.0,  1.0,
		   1.0,  1.0,  1.0,
		   1.0,  1.0, -1.0,
		  
		  // Bottom face
		  -1.0, -1.0, -1.0,
		   1.0, -1.0, -1.0,
		   1.0, -1.0,  1.0,
		  -1.0, -1.0,  1.0,
		  
		  // Right face
		   1.0, -1.0, -1.0,
		   1.0,  1.0, -1.0,
		   1.0,  1.0,  1.0,
		   1.0, -1.0,  1.0,
		  
		  // Left face
		  -1.0, -1.0, -1.0,
		  -1.0, -1.0,  1.0,
		  -1.0,  1.0,  1.0,
		  -1.0,  1.0, -1.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		this.buffer.verticesTextureCoord = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.verticesTextureCoord);

		var textureCoordinates = [
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
			0.0,  1.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
			gl.STATIC_DRAW);

		this.buffer.verticesIndex = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.verticesIndex);

		// This array defines each face as two triangles, using the
		// indices into the vertex array to specify each triangle's
		// position.

		var cubeVertexIndices = [
		  0,  1,  2,      0,  2,  3,    // front
		  4,  5,  6,      4,  6,  7,    // back
		  8,  9,  10,     8,  10, 11,   // top
		  12, 13, 14,     12, 14, 15,   // bottom
		  16, 17, 18,     16, 18, 19,   // right
		  20, 21, 22,     20, 22, 23    // left
		];

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);

		this.buffer.verticesNormal = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.verticesNormal);

		var vertexNormals = [
		  // Front
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		   0.0,  0.0,  1.0,
		  
		  // Back
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		   0.0,  0.0, -1.0,
		  
		  // Top
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		   0.0,  1.0,  0.0,
		  
		  // Bottom
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		   0.0, -1.0,  0.0,
		  
		  // Right
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		   1.0,  0.0,  0.0,
		  
		  // Left
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0,
		  -1.0,  0.0,  0.0
		];

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	}

	initShaders(gl) {
		var fragmentShader = getShader(gl, "shader-fs");
		var vertexShader = getShader(gl, "shader-vs");

		// Create shader program
		this.shaderProgram = gl.createProgram();
		gl.attachShader(this.shaderProgram, vertexShader);
		gl.attachShader(this.shaderProgram, fragmentShader);
		gl.linkProgram(this.shaderProgram);

		// If creation of shader program failed, alert
		if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
			alert("Unable to initialise the shader program: " + gl.getProgramInfoLog(this.shaderProgram));
		}

		this.attribute.vertexPosition = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
		gl.enableVertexAttribArray(this.attribute.vertexPosition);
		this.attribute.textureCoord = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
		gl.enableVertexAttribArray(this.attribute.textureCoord);

		this.attribute.vertexNormal = gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
		gl.enableVertexAttribArray(this.attribute.vertexNormal);
	}

	initTextures(gl) {
		var cubeTexture = this.cubeTexture = gl.createTexture();
		var cubeImage = new Image();
		cubeImage.onload = function() { Cube.handleTextureLoaded(cubeImage, cubeTexture, gl); }
		cubeImage.crossOrigin = 'anonymous';
		cubeImage.src = "./cubetexture.png";
	}

	static handleTextureLoaded(image, texture, gl) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

}