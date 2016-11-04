var gl; // Global variable for WebGL context

var squareRotation = 0.0;
var lastSquareUpdateTime = 0;
var squareOffset = vec3.fromValues(0.0, 0.0, 0.0);
var squareOffsetMod = vec3.fromValues(0.2, -0.4, 0.3);

var timescale = 30;

var cubeVerticesIndexBuffer;
var cubeVerticesBuffer;
var cubeVerticesColorBuffer;
var cubeVerticesTextureCoordBuffer;
var cubeVerticesNormalBuffer;
var vertexNormalAttribute;

function start(){

	var canvas = document.getElementById("glcanvas");

	// Initialise GL context
	gl = initWebGL(canvas);

	// Only continue if WebGL is ready/working
	if (!gl) {
		return;
	}

	// Set clear color to black
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Enable depth testing
	gl.enable(gl.DEPTH_TEST);
	// Near things obscure far things
	gl.depthFunc(gl.LEQUAL);
	// Clear the color as well as the depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	initShaders();
	initBuffers();
	initTextures();

	setInterval(drawScene, 15);
}

function initWebGL(canvas) {

	gl = null;

	// Try to get standard context, if this fails use experimental
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

	// If we don't have a context, give up
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser may not support it.");
	}

	return gl;
}

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	// Create shader program
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creation of shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Unable to initialise the shader program: " + gl.getProgramInfoLog(shaderProgram));
	}

	gl.useProgram(shaderProgram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);

	textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(textureCoordAttribute);

	vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(vertexNormalAttribute);


}

function initTextures() {
	cubeTexture = gl.createTexture();
	cubeImage = new Image();
	cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
	cubeImage.crossOrigin = 'anonymous';
	cubeImage.src = "./cubetexture.png";
}

function handleTextureLoaded(image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

function getShader(gl, id, type) {
	var shaderScript, theSource, currentChild, shader;

	shaderScript = document.getElementById(id);

	if (!shaderScript) {
		return null;
	}

	theSource = shaderScript.text;

	if (!type) {
		if (shaderScript.type == "x-shader/x-fragment") {
			type = gl.FRAGMENT_SHADER;
		} else if (shaderScript.type == "x-shader/x-vertex") {
			type = gl.VERTEX_SHADER;
		} else {
			// Unknown shader type
			return null;
		}
	}

	shader = gl.createShader(type);

	gl.shaderSource(shader, theSource);

	// Compile shader program
	gl.compileShader(shader);

	// Check for successful compile
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

function initBuffers() {
	cubeVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

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

	cubeVerticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);

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

	cubeVerticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

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

	cubeVerticesNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);

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

function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

	loadIdentity();
	mvTranslate([-0.0, 0.0, -10.0]);

	mvPushMatrix();

	mvRotate(squareRotation, [.6, .9, .3]);
	mvTranslate(squareOffset);

	// Draw cube: bind array buffer to cube vertices array, set attrs, push to gl
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

	// Set texture coordinates attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

	// Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

	// Bind normals to shared attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
	gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

	// Draw the cube
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

	// Restore the original matrix
	mvPopMatrix();

	var currentTime = Date.now();
	if (lastSquareUpdateTime) {
		var delta = currentTime - lastSquareUpdateTime;
		squareRotation += (timescale * delta) / 1000.0;

		/* Uncomment the below to re-add bounciness

		vec3.scaleAndAdd(squareOffset, squareOffset, squareOffsetMod, (timescale * delta) / 1000.0);

		if (Math.abs(squareOffset[1]) > 2.5) {
			vec3.negate(squareOffsetMod, squareOffsetMod);
		}*/

	}

	lastSquareUpdateTime = currentTime;
}