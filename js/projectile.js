
var projectileData;
var projectilePatternData;
var enemyProjectileGroup;

function findPattern(name) {
	for( var i = 0; i < projectilePatternData.length; i++ ) {
		if( projectilePatternData[i].name == name ) {
			return projectilePatternData[i];
		}
	}
	return null;
}

function findProjectile(name) {
	for( var i = 0; i < projectileData.length; i++ ) {
		if( projectileData[i].name == name ) {
			return projectileData[i];
		}
	}
	return null;
}

function createPattern(origin, pattern) {
	var pattern = findPattern(pattern);
	var projectileName = pattern.projectile;
	var delay = pattern.delay;
	var interval = pattern.interval;
	var count = pattern.count;
	var patterns = pattern.patterns;

	origin.shootTimer = game.time.create(false);
	var patternIndex = 0;
	for( var i = 0; i < count; i++, patternIndex++ ) {
		if( patternIndex >= patterns.length ) {
			patternIndex = 0;
		}
		
		var netDelay = delay + (interval * (i + 1));
		var offset = patterns[patternIndex].offset;
		var halfOffset = offset * ((patterns[patternIndex].burst - 1) / 2);
		var offsetInterval = 0;
		
		if( patterns[patternIndex].projectile) {
			projectileName = patterns[patternIndex].projectile;
		}else {
			projectileName = pattern.projectile;
		}
		var duration = patterns[patternIndex].duration;
		var onDeath = patterns[patternIndex].onDeath;
		
		// Set target for the projectiles
		var target = {};
		var targeted = patterns[patternIndex].targetPlayer;
		if( patterns[patternIndex].target ) {
			target = patterns[patternIndex].target;
			target.alive = true;
		}
		if( targeted == true) {
			target.x = player.x;
			target.y = player.y;
		}
		var speed = patterns[patternIndex].speed;
		var path = patterns[patternIndex].path;
		for( var j = 0; j < patterns[patternIndex].burst; j++ ) {
			origin.shootTimer.add(netDelay, createProjectile, this, origin, projectileName, target, offsetInterval - halfOffset, speed, duration, onDeath, path);
			offsetInterval += offset;
		}
	}
	origin.shootTimer.start();
}

function createProjectile(origin, name, target, offset, speed, duration, onDeath, path) {
	if(origin.alive == true ) {
		var projectile = findProjectile(name);
		var targetedAngle = 1;
		var movex = 0;
		var movey = speed;
		var originx = origin.x
		var originy = origin.y;
		var targety = 0;
		var targety = 10000;
		
		if( target ) {
			targetx = target.x;
			targety = target.y;
		}
		
		// True target
		targetAngle = game.math.angleBetweenPoints(new Phaser.Point(originx, originy), new Phaser.Point(targetx, targety));
		netAngle = targetAngle + game.math.degToRad(offset);
		
		movex = speed * Math.cos(netAngle);
		movey = speed * Math.sin(netAngle);
		
		var sprite = projectile.sprite;
		var projectile = enemyProjectileGroup.create(originx, originy, sprite);	
		
		projectile.anchor.setTo(0.5, 0.5);
		projectile.body.moves = true;
		projectile.body.setSize(24, 24, 4, 4);
		projectile.body.velocity.x = movex;
		projectile.body.velocity.y = movey;
		
		if( path ) {
			createWaypoints(projectile, path);
		}
		
		if( duration >= 0) {
			console.log(onDeath);
			projectile.death = game.time.create(false);
			projectile.death.add(duration, projectileOnDeath, this, projectile, onDeath);
			projectile.death.start();
		}
	}
}

function projectileOnDeath(projectile, onDeath) {
	var point = {};
	point.x = projectile.x;
	point.y = projectile.y;
	point.alive = true;
	createPattern(point, onDeath);
	projectile.kill();
}