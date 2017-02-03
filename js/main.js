
window.onload = function() {
	game = new Phaser.Game(1000, 800, Phaser.AUTO, '', { preload: preload, create: create, render: render, update: update});
	math = game.math;
}

// Game properties
var game;
var graphics;
var CELL_SIZE = 8;
var GAME_WIDTH = 100;
var GAME_HEIGHT = 75;
var OFFSET_WIDTH = 100;
var OFFSET_HEIGHT = 100;

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
var snakeLength = 10;
var health = 10;

var playerDirection = 0;
var DIRECTION_UP = 0;
var DIRECTION_DOWN = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 3;

// game delay
var speed = 0;
var updateDelay;
var grid;

// UI Elements
var textScore;
var textSpeed;

// Keys
var buttonSpeedUp;
var buttonSpeedDown;

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
	updateDelay = speed;
	
	input = game.input;
	game.input.mouse.capture = true;
    window.graphics = graphics;
	
	buttonSpeedUp = game.input.keyboard.addKey(Phaser.Keyboard.O);
	buttonSpeedUp.onDown.add(speedUp, this);
	buttonSpeedDown = game.input.keyboard.addKey(Phaser.Keyboard.P);
	buttonSpeedDown.onDown.add(speedDown, this);
	
	var style = { font: "15px Courier", fill: "#FFF" };
	textScore = game.add.text(100, 85, "Score: 0", style);
	textSpeed = game.add.text(300, 85, "Speed: 10", style);
}

function render() {
	graphics.clear();
	
	graphics.lineStyle(2,  "0xFFFFFF", 100);
	graphics.drawRect( OFFSET_WIDTH,  OFFSET_HEIGHT, 800, 600);
	graphics.lineStyle(0,  "0xFFFFFF", 100);
	
	for( var i = 0; i < GAME_WIDTH; i++ ) {
		for( var j = 0; j < GAME_HEIGHT; j++ ) { 
			var cellData = grid[i][j];
			
			if( cellData == "F") {
				graphics.beginFill("0x00FF00");
				graphics.drawRect( OFFSET_WIDTH + (i * CELL_SIZE) , OFFSET_HEIGHT + (j * CELL_SIZE), CELL_SIZE, CELL_SIZE);
				graphics.endFill();
			}else if( cellData == 0) {
				graphics.beginFill("0x000000");
				graphics.drawRect( OFFSET_WIDTH + (i * CELL_SIZE) , OFFSET_HEIGHT + (j * CELL_SIZE), CELL_SIZE, CELL_SIZE);
				graphics.endFill();
			}else if( cellData > 0) {
				var decay = ( cellData / (snakeLength) ) * 100;
				console.log(decay);
				var val;
				if( decay <= 1) {
					val = "0x111111";
				}else if( decay <= 2) {
					val = "0x333333";
				}else if( decay <= 3) {
					val = "0x555555";
				}else if( decay <= 4) {
					val = "0x777777";
				}else if( decay <= 5) {
					val = "0x999999";
				}else if( decay <= 6) {
					val = "0xAAAAAA";
				}else if( decay <= 7) {
					val = "0xBBBBBB";
				}else if( decay <= 8) {
					val = "0xCCCCCC";
				}else if( decay <= 9) {
					val = "0xDDDDDD";
				}else if( decay <= 10) {
					val = "0xEEEEEE";
				}else {
					val = "0xFFFFFF";
				}
				graphics.beginFill(val);
				graphics.drawRect( OFFSET_WIDTH +  (i * CELL_SIZE) ,  OFFSET_HEIGHT +  (j * CELL_SIZE), CELL_SIZE, CELL_SIZE);
				graphics.endFill();
			}
		}
	}
}

function updateTextScore() {
	textScore.setText("Score: " + score);
}

function updateTextSpeed() {
	textSpeed.setText("Speed: " + (10 - speed) );
}

function spawnFood() {
	var newX = game.math.roundTo(game.math.between(5, GAME_WIDTH - 5), 0);
	var newY = game.math.roundTo(game.math.between(5, GAME_HEIGHT - 5), 0);
	grid[newX][newY]  = ENTITY_FOOD;
}

function speedUp() {
	if( speed < 9 ) {
		speed++;
		updateTextSpeed();
	}
}

function speedDown() {
	if( speed > 0) {
		speed--;
		updateTextSpeed();
	}
}

function playerUpdate() {
	for( var i = 0; i < GAME_WIDTH; i++ ) {
		for( var j = 0; j < GAME_HEIGHT; j++ ) {
			if( grid[i][j] > 0 ) {
				grid[i][j]--;
			}
		}
	}
	grid[playerX][playerY] = (snakeLength);
	
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
		score += 10 - speed;
		snakeLength += 5;
		spawnFood();
		updateTextScore();
	}else if(grid[playerX][playerY] > 0) {
		score -= ((10 - speed) / 2);
		updateTextScore();
	}
}

function handleInput() {
	var key = input.keyboard;
	if ( (key.isDown(Phaser.KeyCode.LEFT) || key.isDown(Phaser.KeyCode.A)) && playerDirection != DIRECTION_RIGHT) {
		playerDirection = DIRECTION_LEFT;
	}
	if ( (key.isDown(Phaser.KeyCode.RIGHT) || key.isDown(Phaser.KeyCode.D)) && playerDirection != DIRECTION_LEFT) {
		playerDirection = DIRECTION_RIGHT;
	}
	if ( (key.isDown(Phaser.KeyCode.UP) || key.isDown(Phaser.KeyCode.W)) && playerDirection != DIRECTION_DOWN ) {
		playerDirection = DIRECTION_UP;
	}
	if ( (key.isDown(Phaser.KeyCode.DOWN) || key.isDown(Phaser.KeyCode.S)) && playerDirection != DIRECTION_UP) {
		playerDirection = DIRECTION_DOWN;
	}
}

function update() {
	handleInput();
	
	if( updateDelay == 0) {
		playerUpdate();
		updateDelay = speed;
	}else {
		updateDelay--;
	}
}

