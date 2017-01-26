
var events;

function loadScript(script) {
	events = game.time.create(true);
	scripts = script.split("\n");
	for( var i = 0; i < scripts.length; i++ ) {
		var command = scripts[i].split(" ");
		if( command[0] == "#" ) { // comment
			continue;
		}else {
			if( command[0] == "spawn" ) {
				var time = parseInt(command[1]);
				var entity = command[2];
				var x = parseInt(command[3]);
				var y = parseInt(command[4]);
				var count = parseInt(command[5]);
				var delay = parseInt(command[6]);
				var path = parseInt(command[7]);
				var pattern = parseInt(command[8]);
				
				for( var j = 1; j <= count; j++ ) {
					events.add(time + (delay * j), enemyCreate, this, entity, x, y, path, pattern);
				}
			}
		}
	}
	events.start();
}