class StatMon {

	static get DATACAP () { return 100 }
	static get SMOOTHFACTOR () { return 3 }

	constructor() {
		this.loopStartTime = performance.now();
		this.lastRender = performance.now();
		this.loopTimeData = [];
		this.FPSData = [];
		this.FPSSmooth = [];
	}

	draw() {
		this.chart.render();
		this.fpsChart.render();
	}

	init() {
		this.chart = new CanvasJS.Chart("chartContainer", {
			title: {
				text: "Time Per Loop"
			},
			data: [{
				type: "line",
				dataPoints: this.loopTimeData
			}]
		});
		this.fpsChart = new CanvasJS.Chart("fpsChartContainer", {
			title: {
				text: "FPS"
			},
			data: [{
				type: "line",
				dataPoints: this.FPSData
			}]
		});
	}

	startLoop() {
		this.loopStartTime = performance.now();
	}

	finishLoop() {
		this.loopTimeData.push({x: this.loopStartTime, y: performance.now() - this.loopStartTime});
		if(this.loopTimeData.length > StatMon.DATACAP)
			this.loopTimeData.shift();
	}

	drawScene(now) {
		this.FPSSmooth.push(1000 / (now - this.lastRender));
		if(this.FPSSmooth.length > StatMon.SMOOTHFACTOR)
			this.FPSSmooth.shift();
		this.FPSData.push({x: now, y: this.FPSSmooth.reduce(function(a, b) { return a + b }, 0) / StatMon.SMOOTHFACTOR });
		if(this.FPSData.length > StatMon.DATACAP)
			this.FPSData.shift();
		this.lastRender = now;
	}
}