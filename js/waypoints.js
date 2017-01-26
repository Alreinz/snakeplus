

function entityWaypointUpdate(entity) {
	if( entity.hasWaypoint ) {
		entity.x = entity.pathx[entity.currentPath];
		entity.y = entity.pathy[entity.currentPath];
		if( entity.x == undefined ) {
			entity.body.velocity.x = 0;
		}
		if( entity.y == undefined ) {
			entity.body.velocity.y = 100;
		}
		if( entity.currentPath < entity.pathx.length ) {
			entity.currentPath++;
		}
	}
}


function createWaypoints(entity, path) {
	entity.hasWaypoint = true;
	var waypointsx = [];
	var waypointsy = [];
	
	// starting point
	waypointsx.push(entity.x);
	waypointsy.push(entity.y);
	
	for( var j = 0; j < path.waypoints.length; j++ ) {
		if( path.waypoints[j] == "player") {
			waypointsx.push(player.x);
			waypointsy.push(player.y);
		}else if( path.waypoints[j].length == 3) {
			var originx;
			var originy;
			if( path.waypoints[j][0] == "player") {
				originx = player.x;
				originy = player.y;
			}else {
				originx = path.waypoints[j][0][0];
				originy = path.waypoints[j][0][1];
			}
			var minrandx = path.waypoints[j][1][0];
			var minrandy = path.waypoints[j][1][1];
			var maxrandx = path.waypoints[j][2][0];
			var maxrandy = path.waypoints[j][2][1];
			var finalx = originx + game.math.between(minrandx, maxrandx);
			var finaly = originy + game.math.between(minrandy, maxrandy);
			
			waypointsx.push(finalx);
			waypointsy.push(finaly);
		}else {
			waypointsx.push(entity.x + path.waypoints[j][0]);
			waypointsy.push(entity.y + path.waypoints[j][1]);
		}
	}
	entity.pathx = [];
	entity.pathy = [];
	
	var stepCounts;
	var currentStepCount;
	var timeStep;
	var steps;
	
	// interpolating pathing
	if( path.time instanceof Array) { 
		stepCounts = 1 / path.time.length;
		currentStepCount = stepCounts;
		timeStep = 0;
		steps = 1 / path.time[timeStep];
	}else {
		steps = 1 / path.time;
	}
	
	for( var j = 0; j <= 1; j += steps ) {
		var interpolation = path.type;
		if( j >= currentStepCount ) {
			currentStepCount += stepCounts;
			timeStep++;
			steps = 1 / path.time[timeStep];
		}
		if( interpolation == 0 ) {
			entity.pathx.push(game.math.linearInterpolation( waypointsx, j));
			entity.pathy.push(game.math.linearInterpolation( waypointsy, j));
		}else if( interpolation == 1 ) {
			entity.pathx.push(game.math.bezierInterpolation( waypointsx, j));
			entity.pathy.push(game.math.bezierInterpolation( waypointsy, j));
		}else if( interpolation == 2 ) { 
			entity.pathx.push(game.math.catmullRomInterpolation( waypointsx, j));
			entity.pathy.push(game.math.catmullRomInterpolation( waypointsy, j));
		}
	}
	entity.currentPath = 0;
}