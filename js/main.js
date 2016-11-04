requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

var gl; // Global variable for WebGL context

var lastUpdate = Date.now();

var cubes = [];

requirejs(['sylvester', 'glUtils', 'gl-matrix', 'Cube'],
		start);

function start() {
	var canvas = document.getElementById("glcanvas");

	for (i = 0; i < 100; i++) {
		cubes.push(new Cube());
	}

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

	for (i in cubes) {
		cubes[i].init(gl);
	}

	setInterval(gameLoop, 15);
}

function gameLoop() {
	updateScene();
	drawScene();
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

function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

	loadIdentity();
	mvTranslate([-0.0, 0.0, -20.0]);

	

	for (i in cubes) {
		mvPushMatrix();
		cubes[i].draw(gl);
		mvPopMatrix();
	}


}

function updateScene() {
	var now = Date.now();
	var deltaT = now - lastUpdate;
	
	for (i in cubes) {
		cubes[i].update(deltaT);
	}

	lastUpdate = now;
}