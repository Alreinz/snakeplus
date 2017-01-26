

function bulletEnemyCollisionHandler(bullet, enemy) {
	enemy.damage(bullet.damage);
	bullet.kill();
}