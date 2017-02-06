
window.onload = function() {
	game = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.AUTO, 'game');
	game.state.add(STATE_MENU, stateMenu);
	game.state.add(STATE_PLAY, statePlay);
	game.state.add(STATE_SCORE, stateScore);
	game.state.add(STATE_SCOREBOARD, stateScoreboard);
	game.state.start(STATE_MENU);
	
	math = game.math;
}

// Game properties
var game;
var graphics;
var CELL_SIZE = 8;
var SCREEN_WIDTH = 1000;
var SCREEN_HEIGHT = 700;
var GAME_WIDTH = 100;
var GAME_HEIGHT = 75;
var OFFSET_WIDTH = 50;
var OFFSET_HEIGHT = 50;

// Game States
var gameState;
var STATE_MENU = "menu";
var STATE_PLAY = "play";
var STATE_SCORE = "score";
var STATE_SCOREBOARD = "scoreboard";

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
var speed = 1;
var updateDelay;
var grid;

// UI Elements
// -- Menu items --
var imageTitle;
var textStartGame;
// -- Game proper --
var textScore;
var textSpeed;
var blinked=false;
// -- Scoreboard --
var textCursor;
var textUsername;
var textNewScore;
var textEnterToSave;

// Keys
var buttonSpeedUp;
var buttonSpeedDown;
var buttonEnter;
var buttonBackspace;
var buttonSpace;

// Buffer
var usernameBuffer = "";
var style = { font: "15px Courier", fill: "#FFF" };

var sfxKeyPress;
var sfxFood;

var stateMenu = {
	
	preload: function() {
		game.load.image('title', 'res/title.png');
		game.load.audio('keysfx', 'res/key_press.wav');
	},
	
	create: function() {
		sfxKeyPress = game.add.audio('keysfx');
		
		imageTitle = game.add.sprite( 0, 0, 'title');
		imageTitle.x = (SCREEN_WIDTH / 2) - (imageTitle.width / 2);
		imageTitle.y = (SCREEN_HEIGHT / 2) - (imageTitle.height / 2) - 50;
	
		var text = "Press space key to start game";
		textStartGame = game.add.text((SCREEN_WIDTH / 2) - (4.5 * text.length), SCREEN_HEIGHT / 2, text, style);
		
		var buttonGameStart = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		buttonGameStart.onDown.addOnce(this.playGame, this);
		buttonGameStart.timer = game.time.create(false);
		buttonGameStart.timer.loop(250, this.blink, this);
		buttonGameStart.timer.start();
	},
	
	playGame: function() {
		sfxKeyPress.play();
		game.state.start(STATE_PLAY);
	},
	
	blink: function() {
		if ( blinked == true ) {
			blinked = false;
			textStartGame.setText("");
		}else {
			textStartGame.setText("Press space key to start game");
			blinked = true;
		}
	}
}

var stateScoreboard = {

	preload: function() {
		game.load.image('title', 'res/title.png');
		game.load.audio('keysfx', 'res/key_press.wav');
	},
	
	create: function() {
		sfxKeyPress = game.add.audio('keysfx');
		
		game.input.keyboard.removeKey(Phaser.KeyCode.BACKSPACE);
		game.input.keyboard.removeKey(Phaser.KeyCode.SPACEBAR);
		
		imageTitle = game.add.sprite( 0, 0, 'title');
		imageTitle.x = (SCREEN_WIDTH / 2) - (imageTitle.width / 2);
		imageTitle.y = 100;
		
		var text = "Scoreboard";
		game.add.text((SCREEN_WIDTH / 2) - (9 * text.length) / 2, 175, text, style);
		
		var text = "Press space key to return to menu";
		textStartGame = game.add.text((SCREEN_WIDTH / 2) - (4.5 * text.length), SCREEN_HEIGHT / 2, text, style);
		
		var buttonGameStart = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		buttonGameStart.onDown.addOnce(this.playGame, this);
		buttonGameStart.timer = game.time.create(false);
		buttonGameStart.timer.loop(250, this.blink, this);
		buttonGameStart.timer.start();
		
		$.ajax({
			type: 'post',
			url: 'php/getscores.php',
			dataType: 'json',
			success: function(data) {
				for( var i = 0; i < data.length; i++ ) {
					game.add.text(270, 200 + (i * 15), (i + 1) + ".", style);
					game.add.text(300, 200 + (i * 15), data[i].username, style);
					game.add.text(450, 200 + (i * 15), data[i].score, style);
					game.add.text(550, 200 + (i * 15), data[i].timestamp, style);
					game.add.text(270, 200 + (i * 15), "__________________________________________________", style);
				}
			}
		});
	},
	
	playGame: function() {
		sfxKeyPress.play();
		game.state.start(STATE_MENU);
	},

	blink: function() {
		if ( blinked == true ) {
			blinked = false;
			textStartGame.setText("");
		}else {
			textStartGame.setText("Press space key to return to menu");
			blinked = true;
		}
	}
}

var stateScore = {
	
	preload: function() {
		game.load.image('title', 'res/title.png');
		game.load.audio('keysfx', 'res/key_press.wav');
	},
	
	create: function() {
		sfxKeyPress = game.add.audio('keysfx');
		usernameBuffer = "";
		
		game.input.keyboard.removeKey(Phaser.KeyCode.O);
		game.input.keyboard.removeKey(Phaser.KeyCode.P);
		
		imageTitle = game.add.sprite( 0, 0, 'title');
		imageTitle.x = (SCREEN_WIDTH / 2) - (imageTitle.width / 2);
		imageTitle.y = (SCREEN_HEIGHT / 2) - (imageTitle.height / 2) - 50;
		
		game.input.keyboard.addKeyCapture([
			Phaser.Keyboard.SPACEBAR,
			Phaser.Keyboard.ENTER,
			Phaser.Keyboard.BACKSPACE
		]);
		buttonSpace = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		buttonSpace.onDown.add(this.space);
		buttonBackspace = game.input.keyboard.addKey(Phaser.KeyCode.BACKSPACE);
		buttonBackspace.onDown.add(this.backspace);
		
		buttonEnter = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
		buttonEnter.onDown.add(this.saveScore);
		
		
		if( score > 0 ) {		
			game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
			
			game.add.text((SCREEN_WIDTH / 2) - 140, (SCREEN_HEIGHT / 2), "Enter username:", style);
			game.add.text((SCREEN_WIDTH / 2) - 60, (SCREEN_HEIGHT / 2)  - 15, "Score:", style);
			textEnterToSave = game.add.text((SCREEN_WIDTH / 2) - 130, (SCREEN_HEIGHT / 2) + 50, "Press enter key to save score", style);
			
			textUsername = game.add.text((SCREEN_WIDTH / 2), (SCREEN_HEIGHT / 2), usernameBuffer, style);
			textNewScore = game.add.text((SCREEN_WIDTH / 2), (SCREEN_HEIGHT / 2) - 15, score, style);
			
			textCursor = game.add.text((SCREEN_WIDTH / 2), SCREEN_HEIGHT / 2, "_", style);
			textCursor.timer = game.time.create(false);
			textCursor.timer.loop(250, this.blink, this);
			textCursor.timer.start();
		}else {
			var text =  "You did not score anything";
			game.add.text((SCREEN_WIDTH / 2) - (4.5 * text.length), (SCREEN_HEIGHT / 2)  - 15, text, style);
			var text =  "Press enter key to continue";
			textEnterToSave = game.add.text((SCREEN_WIDTH / 2) - (4.5 * text.length), (SCREEN_HEIGHT / 2) + 50, text, style);
		}
	},
	
	keyPress: function(key) {
		usernameBuffer = usernameBuffer.concat(key);
		textCursor.x += 9;
		this.updateUserName();
	},
	
	backspace: function() {
		if(usernameBuffer.length > 0) {
			usernameBuffer = usernameBuffer.slice(0, usernameBuffer.length - 1);
			textUsername.setText(usernameBuffer);
			textCursor.x -= 9;
		}
	},
	
	space: function() {
		usernameBuffer = usernameBuffer.concat(" ");
		textUsername.setText(usernameBuffer);
		textCursor.x += 9;
	},
	
	saveScore: function() {
		if( score > 0 ) {
			if( usernameBuffer.length >= 3) {
				$.ajax({
					type: 'post',
					data: {username: usernameBuffer, score:score},
					url: 'php/newscore.php',
					dataType: 'json',
					complete: function() {
						sfxKeyPress.play();
						game.state.start(STATE_SCOREBOARD);
					}
				});
				textEnterToSave.setText("Saving...");
				game.input.keyboard.removeKey(Phaser.KeyCode.ENTER);
			}else {
				alert("Too short");
			}
		}else {
			sfxKeyPress.play();
			game.state.start(STATE_SCOREBOARD);
		}
	},
	
	updateUserName: function() {
		textUsername.setText(usernameBuffer);
	},
	
	blink: function() {
		if ( blinked == true ) {
			blinked = false;
			textCursor.setText("");
		}else {
			textCursor.setText("_");
			blinked = true;
		}
	}
}

var statePlay = { 
	preload: function() {
		game.load.audio('sfxFood', 'res/food.wav');
		game.load.audio('sfxDeath', 'res/death.wav');
	},

	create: function () {
		sfxFood = game.add.audio('sfxFood');
		sfxDeath = game.add.audio('sfxDeath');
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
		
		this.spawnFood();
		
		playerX = Math.round(GAME_WIDTH / 2);
		playerY = Math.round(GAME_HEIGHT / 2);
		updateDelay = speed;
		score = 0;
		snakeLength = 10;
		playerDirection = DIRECTION_UP;
		
		input = game.input;
		game.input.mouse.capture = true;
		window.graphics = graphics;
		
		buttonSpeedUp = game.input.keyboard.addKey(Phaser.Keyboard.O);
		buttonSpeedUp.onDown.add(this.speedUp, this);
		buttonSpeedDown = game.input.keyboard.addKey(Phaser.Keyboard.P);
		buttonSpeedDown.onDown.add(this.speedDown, this);
		
		textScore = game.add.text(100, OFFSET_HEIGHT - 15, "Score: 0", style);
		textSpeed = game.add.text(300, OFFSET_HEIGHT - 15, "Speed: 9", style);
		game.add.text(100, 650, "WASD/Arrow Keys - Movement", style);
		game.add.text(500, 650, "O - Increase Speed", style);
		game.add.text(500, 665, "P - Decrease Speed", style);
	},
	
	render: function () {
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
	},

	update: function () {
		this.handleInput();
		
		if( updateDelay == 0) {
			this.playerUpdate();
			updateDelay = speed;
		}else {
			updateDelay--;
		}
	},

	updateTextScore: function () {
		textScore.setText("Score: " + score);
	},

	updateTextSpeed: function () {
		textSpeed.setText("Speed: " + (10 - speed) );
	},

	spawnFood: function () {
		var newX = game.math.roundTo(game.math.between(5, GAME_WIDTH - 5), 0);
		var newY = game.math.roundTo(game.math.between(5, GAME_HEIGHT - 5), 0);
		grid[newX][newY]  = ENTITY_FOOD;
	},

	speedUp: function () {
		if( speed > 0) {
			speed--;
			this.updateTextSpeed();
		}
	},

	speedDown: function () {
		if( speed < 9 ) {
			speed++;
			this.updateTextSpeed();
		}
	},
	
	playerUpdate: function () {
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
		}else if(playerDirection == DIRECTION_DOWN) {
			playerY++;
			
			if(playerY == GAME_HEIGHT) {
				playerY = 0;
			}
		}else if(playerDirection == DIRECTION_LEFT) {
			playerX--;
			
			if(playerX == -1) {
				playerX = GAME_WIDTH - 1;
			}
		}else if(playerDirection == DIRECTION_RIGHT) {
			playerX++;
			
			if(playerX == GAME_WIDTH) {
				playerX = 0;
			}
		}
		
		if(grid[playerX][playerY] == "F") {
			score += 10 - speed;
			snakeLength += 5;
			this.spawnFood();
			this.updateTextScore();
			sfxFood.play();
		}else if(grid[playerX][playerY] > 0) {
			sfxDeath.play();
			game.state.start(STATE_SCORE);
			/*
			score -= ((10 - speed) / 2);
			this.updateTextScore();
			*/
		}
	},

	handleInput: function () {
		var key = input.keyboard;
		if ( (key.isDown(Phaser.KeyCode.LEFT) || key.isDown(Phaser.KeyCode.A)) && playerDirection != DIRECTION_RIGHT) {
			playerDirection = DIRECTION_LEFT;
		}else if ( (key.isDown(Phaser.KeyCode.RIGHT) || key.isDown(Phaser.KeyCode.D)) && playerDirection != DIRECTION_LEFT) {
			playerDirection = DIRECTION_RIGHT;
		}else if ( (key.isDown(Phaser.KeyCode.UP) || key.isDown(Phaser.KeyCode.W)) && playerDirection != DIRECTION_DOWN ) {
			playerDirection = DIRECTION_UP;
		}else if ( (key.isDown(Phaser.KeyCode.DOWN) || key.isDown(Phaser.KeyCode.S)) && playerDirection != DIRECTION_UP) {
			playerDirection = DIRECTION_DOWN;
		}
	}
}


