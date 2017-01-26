
function explosion(object) {
	for( var i = 0; i < 5; i++ ) {
		var randx = game.rnd.between(-10, 10);
		var randy = game.rnd.between(-10, 10);
		var explosion = game.add.sprite(object.x + randx, object.y + randy, 'explosion_small');
		explosion.anchor.setTo(0.5, 0.5);
		explosion.animations.add('boom', [ 0, 1, 2, 3], 20, true);
		explosion.play('boom', 20, false, true);
	}
}