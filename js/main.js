
window.onload = function() {
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, render: render, update: update});
	math = game.math;
}

// Game properties
var game;
var graphics;
var CELL_SIZE = 8;
var GAME_WIDTH = 100;
var GAME_HEIGHT = 75;

// Game States
var gameState;
var STATE_MENU = 0;
var STATE_PLAY = 1;
var STATE_SETTINGS = 2;
var STATE_PAUSED = 3;

// Game entities
var ENTITY_FOOD = "F";
var ENTITY_ITEMS = 2;

// Game inputs
var input;

// Player and player project properties and methods
var player;
var playerX;
var playerY;

// Player properties
var score = 0;
var health = 10;
var playerSpeed = 250;
var playerAcceleration = 100;

var playerDirection = 0;
var DIRECTION_UP = 0;
var DIRECTION_DOWN = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 3;

var updateDelay;
var grid;

function preload () {
}

function create () {
    graphics = game.add.graphics(0, 0);
	grid = new Array(GAME_WIDTH);	// height
	for( var i = 0; i < GAME_WIDTH; i++) {
		grid[i] = new Array(GAME_HEIGHT);	// width
	}
	
	for( var i = 0; i < GAME_WIDTH; i++ ) {
		for( var j = 0; j < GAME_HEIGHT; j++ ) {
			grid[i][j] = 0;
		}
	}
	
	spawnFood();
	
	playerX = 15;
	playerY = 17;
	updateDelay = 10;
	
	input = game.input;
	game.input.mouse.capture = true;
    window.graphics = graphics;
}

function render() {
	graphics.clear();
	for( var i = 0; i < GAME_WIDTH; i++ ) {
		for( var j = 0; j < GAME_HEIGHT; j++ ) { 
			var cellData = grid[i][j];
			
			if( cellData == "F") {
				graphics.beginFill("0x00FF00");
				graphics.drawRect( (i * CELL_SIZE) ,  (j * CELL_SIZE), CELL_SIZE, CELL_SIZE);
				graphics.endFill();
			}else if( cellData == 0) {
				graphics.beginFill("0x000000");
				graphics.drawRect( (i * CELL_SIZE) ,  (j * CELL_SIZE), CELL_SIZE, CELL_SIZE);
				graphics.endFill();
			}else if( cellData > 0) {
				var decay = ( cellData / (score + 5)) * 100;
				var val;
				if( decay <= 10 ) {
					val = "0x111111";
				}else if( decay <= 20) {
					val = "0x444444";
				}else if( decay <= 30) {
					val = "0x777777";
				}else if( decay <= 40) {
					val = "0xAAAAAA";
				}else if( decay <= 50) {
					val = "0xDDDDDD";
				}else {
					val = "0xFFFFFF";
				}
				graphics.beginFill(val);
				graphics.drawRect( (i * CELL_SIZE) ,  (j * CELL_SIZE), CELL_SIZE, CELL_SIZE);
				graphics.endFill();
			}
		}
	}
}

function spawnFood() {
	var newX = game.math.roundTo(game.math.between(5, GAME_WIDTH - 5), 0);
	var newY = game.math.roundTo(game.math.between(5, GAME_HEIGHT - 5), 0);
	grid[newX][newY]  = ENTITY_FOOD;
}

function playerUpdate() {
	for( var i = 0; i < GAME_WIDTH; i++ ) {
		for( var j = 0; j < GAME_HEIGHT; j++ ) {
			if( grid[i][j] > 0 ) {
				grid[i][j]--;
			}
		}
	}
	grid[playerX][playerY] = (score + 10);
	
	if(playerDirection == DIRECTION_UP) {
		playerY--;
		
		if(playerY == -1) {
			playerY = GAME_HEIGHT - 1;
		}
	}
	
	if(playerDirection == DIRECTION_DOWN) {
		playerY++;
		
		if(playerY == GAME_HEIGHT) {
			playerY = 0;
		}
	}
	
	if(playerDirection == DIRECTION_LEFT) {
		playerX--;
		
		if(playerX == -1) {
			playerX = GAME_WIDTH - 1;
		}
	}
	
	if(playerDirection == DIRECTION_RIGHT) {
		playerX++;
		
		if(playerX == GAME_WIDTH) {
			playerX = 0;
		}
	}
	
	if(grid[playerX][playerY] == "F") {
		score += 2;
		spawnFood();
	}
}

function handleInput() {
	var key = input.keyboard;
	if ( key.isDown(Phaser.KeyCode.LEFT) || key.isDown(Phaser.KeyCode.A)) {
		playerDirection = DIRECTION_LEFT;
	}
	if (key.isDown(Phaser.KeyCode.RIGHT) || key.isDown(Phaser.KeyCode.D) ) {
		playerDirection = DIRECTION_RIGHT;
	}
	if (key.isDown(Phaser.KeyCode.UP) || key.isDown(Phaser.KeyCode.W) ) {
		playerDirection = DIRECTION_UP;
	}
	if (key.isDown(Phaser.KeyCode.DOWN) || key.isDown(Phaser.KeyCode.S) ) {
		playerDirection = DIRECTION_DOWN;
	}
}

function update() {
	handleInput();
	playerUpdate();
}

