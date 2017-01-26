
window.onload = function() {
	game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, render: render, update: update});
	math = game.math;
}

var game;
var math;

// Game inputs
var input;
var buttonShoot;
var clickLeft;
var clickRight;


function preload () {
	// player
	game.load.image('player', 'res/player/player.png');
	game.load.spritesheet('player_projectile', 'res/player/player_projectile.png', 32, 32);

	// enemies
	game.load.image('enemy_ship_1', 'res/enemies/grunts/enemy_ship_1.png');
	
	// enemy bullets
	game.load.image('bullet_round_red', 'res/projectiles/bullet_round_red.png');
	game.load.image('bullet_round_blue', 'res/projectiles/bullet_round_blue.png');
	game.load.image('bullet_round_purple', 'res/projectiles/bullet_round_purple.png');
	game.load.image('bullet_round_yellow', 'res/projectiles/bullet_round_yellow.png');
	
	// visual effects
	game.load.spritesheet('explosion_small', 'res/effects/explosion_small.png', 16, 16);
	
	// scripts
	game.load.text('level_1', 'data/scripts/level_1.script');
	game.load.json('enemy', 'data/enemy.json');
	game.load.json('projectile', 'data/projectile.json');
	game.load.json('projectilePattern', 'data/projectilePatterns.json');
}

function create () {
	enemyData = game.cache.getJSON('enemy').enemyData;
	projectileData = game.cache.getJSON('projectile').projectileData;
	projectilePatternData = game.cache.getJSON('projectilePattern').patternData;
	var levelScriptData = game.cache.getText('level_1');
	
	enemies = game.add.group();
	enemies.enableBody = true;
	enemies.physicsBodyType = Phaser.Physics.ARCADE;
		
	enemyProjectileGroup = game.add.group();
	enemyProjectileGroup.enableBody = true;
	enemyProjectileGroup.physicsBodyType = Phaser.Physics.ARCADE;
	
	loadScript(levelScriptData);
	playerCreate();
	
	input = game.input;
	game.input.mouse.capture = true;
	clickLeft = game.input.activePointer.leftButton;
	clickRight = game.input.activePointer.rightButton;
	buttonShoot = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function render() {
	
}

function update() {
	if (player.alive) {
		//  Reset the player, then check for movement keys
		player.body.velocity.setTo(0, 0);
		var key = input.keyboard;
		if ( key.isDown(Phaser.KeyCode.LEFT) || key.isDown(Phaser.KeyCode.A)) {
			player.body.velocity.x = -playerSpeed;
		}
		if (key.isDown(Phaser.KeyCode.RIGHT) || key.isDown(Phaser.KeyCode.D) ) {
			player.body.velocity.x = playerSpeed;
		}
		if (key.isDown(Phaser.KeyCode.UP) || key.isDown(Phaser.KeyCode.W) ) {
			player.body.velocity.y = -playerSpeed;
		}
		if (key.isDown(Phaser.KeyCode.DOWN) || key.isDown(Phaser.KeyCode.S) ) {
			player.body.velocity.y = playerSpeed;
		}
		if ( clickLeft.isDown || buttonShoot.isDown ) { 
			playerShoot();
		}
	}
	
	if(shootDelay > 0) {
		shootDelay--;
	}
	
	enemies.forEachAlive(entityWaypointUpdate, this);
	enemyProjectileGroup.forEachAlive(entityWaypointUpdate, this);
	game.physics.arcade.overlap(bullets, enemies, bulletEnemyCollisionHandler, null, this);
}

