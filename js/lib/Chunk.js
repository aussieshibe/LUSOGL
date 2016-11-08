class Chunk {

	static get SIZE() {
		return 10;
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

	constructor(position) {

		/**
		 * Cubes are stored in a 1d array cube at x,y,z position can be
		 *  found with i = (z * Math.pow(Chunk.SIZE, 2)) + (y * Chunk.SIZE) + x
		 */
		this.cubes = new Array(Chunk.CUBECOUNT);

		// Generate some cubes to fill the chunk - TESTING ONLY
		for (var i = Chunk.CUBECOUNT - 1; i >= 0; i--) {
			this.cubes[i] = new Cube(Chunk.CUBECOORDSFROMINDEX(i));
		}

		this.model = {
			'vertices' : [],
			'textureCoordinates' : [],
			'cubeVertexIndices' : [],
			'vertexNormals' : []
		};

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

		this.updated = true;

		this.shaderProgram;
		this.cubeTexture;
		this.position = position || [0, 0, 0];
	}

	draw(gl) {

		gl.useProgram(this.shaderProgram);

		mvTranslate(this.position);
		
		// Draw Chunk: bind array buffer to Chunk vertices array, set attrs, push to gl
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
		
		// Draw the Chunk
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.verticesIndex);
		setMatrixUniforms(gl, this.shaderProgram);
		gl.drawElements(gl.TRIANGLES, this.model.cubeVertexIndices.length, gl.UNSIGNED_SHORT, 0);
	}

	update(deltaT) {
		for (var i = Chunk.CUBECOUNT - 1; i >= 0; i--) {
			this.cubes[i].update(deltaT);
		}
		if(this.updated) {
			//this.updateModel();
		}
	}

	updateModel() {
		for (var i = Chunk.CUBECOUNT - 1; i >= 0; i--) {
			var vertexOffset = this.model.vertices.length;
			this.model.vertices.push.apply(this.model.vertices, this.cubes[i].getVertices());
			this.model.textureCoordinates.push.apply(this.model.textureCoordinates, this.cubes[i].getTextureCoords());
			this.model.cubeVertexIndices.push.apply(this.model.cubeVertexIndices, this.cubes[i].getVertexIndices(vertexOffset / 3));
			this.model.vertexNormals.push.apply(this.model.vertexNormals, this.cubes[i].getVertexNormals());
		}
		console.log("Vertices: " + this.model.vertices.length);
		console.log("Tex coords: " + this.model.textureCoordinates.length);
		console.log("Vertex indices: " + this.model.cubeVertexIndices.length);
		console.log("Vertex normals: " + this.model.vertexNormals.length);
		this.updated = false;
	}

	/**
	 * Init all cubes
	 */
	init(gl) {
		for (var i = Chunk.CUBECOUNT - 1; i >= 0; i--) {
			this.cubes[i].init(gl);
		}
		this.updateModel();
		this.initShaders(gl);
		this.initTextures(gl);
		this.initBuffers(gl);
	}

	/**
	 * Setup gl buffers based on data in model
	 */
	initBuffers(gl) {
		// Update vertex buffer
		this.buffer.vertices = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.vertices);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.vertices), gl.STATIC_DRAW);
		// Update textureCoord buffer
		this.buffer.verticesTextureCoord = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.verticesTextureCoord);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.textureCoordinates), gl.STATIC_DRAW);
		// Update 
		this.buffer.verticesIndex = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.verticesIndex);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.model.cubeVertexIndices), gl.STATIC_DRAW);

		this.buffer.verticesNormal = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.verticesNormal);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.vertexNormals), gl.STATIC_DRAW);
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
		cubeImage.onload = function() { Chunk.handleTextureLoaded(cubeImage, cubeTexture, gl); }
		cubeImage.crossOrigin = 'anonymous';
		cubeImage.src = "./cubetexture.png";1
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