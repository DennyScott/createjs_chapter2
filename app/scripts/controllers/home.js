'use strict';

/**
 * @ngdoc function
 * @name simApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the simApp
 */
angular.module('Sim')
.controller('HomeCtrl', function ($scope) {
	
	var game = {};
	var stage;
	var queue;
	var circle;
	var loaderBar;
	var loadInterval;
	var percentLoaded = 0;
	var LOADER_WIDTH = 400;
	
	function init() {
		queue = new createjs.LoadQueue(false);
		queue.installPlugin(createjs.Sound);
		queue.addEventListener("complete", loadComplete);

		queue.loadManifest([
			{
				id: 'butterfly', 
				src:'images/butterfly.png'
			},
			{
				id:"woosh",
				src:'sounds/woosh.mp3'
			},
			{
				id: 'chime',
				src: 'sounds/chime.mp3'
			},
				{
				id:'daisy', 
				src:'images/daisy.png'
		  }

		]);

		console.log('loaded');
	}	

	function loadComplete(event) {
		setupStage();
		buildButterflies();
		createSquare();
		createScreen();
		createCircle();
		buildLoaderBar();
		startLoad();
		update();
	}

	function buildLoaderBar() {
		loaderBar = new createjs.Shape();
		loaderBar.x = loaderBar.y = 100;
		loaderBar.graphics.setStrokeStyle(2);
		loaderBar.graphics.beginStroke('#000');
		loaderBar.graphics.drawRect(0,0, LOADER_WIDTH, 40);
		stage.addChild(loaderBar);
	}

	function updateLoaderBar() {
		loaderBar.graphics.clear();
		loaderBar.graphics.beginFill('#00ff00');
		loaderBar.graphics.drawRect(0,0, LOADER_WIDTH * percentLoaded, 40);
		loaderBar.graphics.endFill();
		loaderBar.graphics.setStrokeStyle(2);
		loaderBar.graphics.beginStroke('#000');
		loaderBar.graphics.drawRect(0,0,LOADER_WIDTH, 40);
		loaderBar.graphics.endStroke();
	}

	function startLoad() {
		loadInterval = setInterval(updateLoad, 50);
	}

	function updateLoad() {
		percentLoaded += .005;
		updateLoaderBar();
		if(percentLoaded >= 1){
			clearInterval(loadInterval);
			stage.removeChild(loaderBar);
		}
	}

	function createScreen() {
		var screen = new createjs.Shape();
		screen.graphics.beginFill(createjs.Graphics.getRGB(0,0,0,0.6));
		screen.graphics.drawRect(0,0,stage.canvas.width,  stage.canvas.height);
		stage.addChild(screen);
	}

	function setupStage() {
		stage = new createjs.Stage('myCanvas');
		console.log('stage setup');
	}

	function update() {
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick', tick);

	}

	function createCircle() {
		circle = new createjs.Shape();
		circle.graphics.beginStroke('#000');
		circle.graphics.beginFill('#FFF000');
		circle.graphics.drawCircle(0,0,50);
		circle.x = 250;
		circle.y = 70;
		circle.radius = 50;
		circle.speed = 10;
		circle.direction = 1;
		stage.addChild(circle);
	}

	function updateCircle() {
		var nextX = circle.x + (circle.speed * circle.direction);
		if(nextX > stage.canvas.width - circle.radius){
			nextX = stage.canvas.width - circle.radius;
			circle.direction *= -1;
		} else if(nextX < circle.radius) {
			nextX = circle.radius;
			circle.direction *= -1;
		}
		circle.nextX = nextX;
	}

	function renderCircle() {
		circle.x = circle.nextX;
	}

	function tick(e){
		if(!e.paused){
			updateCircle();
			renderCircle();
			stage.update();		
		}
	
	}

	function createSquare(){
		var squareSize = 100;
		var g = new createjs.Graphics()
			.beginStroke('#000')
			.beginFill('#ff0000')
			.drawRect(0,0,squareSize,squareSize);

		var square = new createjs.Shape(g);
		square.regX = square.regY = squareSize / 2;
		square.x = stage.canvas.width / 2;
		square.y = stage.canvas.height / 2;
		stage.addChild(square);
		createjs.Tween.get(square).to({rotation:360}, 3000);
	}

	function buildButterflies() {
		console.log('starting butterflies');
		var img = queue.getResult('butterfly');
		var i, sound, butterfly;
		for( i = 0; i < 3; i++){
			console.log('butterfly image');
			butterfly = new createjs.Bitmap(img);
			butterfly.x = i * 200;
			stage.addChild(butterfly);

			createjs.Tween.get(butterfly).wait(i * 1000)
				.to({y:100}, 1000, createjs.Ease.quadOut)
				.call(butterflyComplete);
			sound = createjs.Sound.play('woosh', createjs.Sound.INTERRUPT_NONE, i * 1000);
		}

		console.log('build butterflies');
	}

	function butterflyComplete() {
		stage.removeChild(this);

		if(!stage.getNumChildren()){
			createjs.Sound.play('chime');
		}

		console.log('butterfly complete');
	}
	
	init();
});
