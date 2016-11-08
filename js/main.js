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
var canvas;
var camera;
var chunk;
var statMon;
var gameTimer;

requirejs(['sylvester', 'gl-matrix', 'glUtils', 'Cube', 'Chunk', 'Camera', 'canvasjs.min', 'StatMon', 'GameTimer'],
		start);

function start() {
	canvas = document.getElementById("glcanvas");
	camera = new Camera();
	chunk = new Chunk();
	gameTimer = new GameTimer();

	statMon = new StatMon();

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
	// Enable backface culling
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	// Clear the color as well as the depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gameTimer.init();
	camera.init();
	chunk.init(gl);
	statMon.init();

	setInterval(() => statMon.draw(), 200);

	gameTimer.addUpdatable(camera);
	gameTimer.addUpdatable(chunk);
	gameTimer.addDrawable(chunk);

	mainLoop(performance.now());
}

function mainLoop(tFrame) {
	gameTimer.stopMain = window.requestAnimationFrame (mainLoop);
	statMon.startLoop();
	gameTimer.run(tFrame);
	statMon.finishLoop();
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