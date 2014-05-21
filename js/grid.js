/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
******************************************************/

/*
	Constructs an empty 4 by 4 grid.
*/
function Grid() {
	this.gridSize = 4;
	this.moveMap = [];
	this.tiles = [[],[],[],[]];
	this.previousState = [[],[],[],[]];
	this.newTile = null;
};

/*
	Iterator for the tiles in the grid, applies the given function
	to all tiles in the grid
*/
Grid.prototype.eachCell = function(fun) {
	for (var i = this.gridSize-1; i >= 0; i--) {
		for (var j = this.gridSize-1; j >= 0; j--) {
			fun(i, j, this.tiles[i][j]);
		};
	};
};

/*
	Inserts the tile in the grid in the correct cell
*/
Grid.prototype.insertTile = function(tile) {
	this.tiles[tile.x][tile.y] = tile;
};

/*
	Removes the tile from the grid, does nothing when passed null
*/
Grid.prototype.removeTile = function(tile) {
	if(tile)
		this.tiles[tile.x][tile.y] = null;
};

/*
	Updates the position of the specified tile, without removing it from the grid.
*/
Grid.prototype.updateTile = function(tile, newPos) {
	this.removeTile(tile);
	tile.updatePosition(newPos);
	this.insertTile(tile);
}

/*
	Returns an array of all the free positions in the grid
*/
Grid.prototype.freePositions = function() {
	var free = [];
	var self = this;
	this.eachCell(function(x,y,tile) {
		if(!tile)
			free.push({x: x, y: y});
	});
	return free;
};

/*
	Returns a random empty position.
*/
Grid.prototype.getRandomPosition = function() {
	var freeTiles = this.freePositions();
	if(freeTiles.length)
		return freeTiles[Math.floor(Math.random()*freeTiles.length)];
};

/*
	Initializes the grid with two tiles.
*/
Grid.prototype.init = function() {
	//add two tiles at random positions
	this.generateTile();
	this.generateTile();
	this.newTile = null;
};

/*
	Returns a tuple {newPos, mergeTarget} of the new position of the tile at the given
	position, and the tile with which it merged, if any.
*/
Grid.prototype.getMovePosition = function(pos, dir) {
	var merge = null;
	var newPos = {x:pos.x, y:pos.y};
	switch(dir) {
		case 0: //up
			for(var i = gridSize-1; i>=pos+1; i--) {
				if(pos.y == gridSize-1)
					newPos = pos;
				if(!this.tiles[pos.x][i]) {
					newPos = {x:pos.x, y:i}
				}
				else if(this.tiles[pos.x][i].level == this.tiles[pos.x][pos.y].level)
					merge = this.tiles[pos.x][i];
			};
			break;
		case 1: //right
			for(var i = pos.x; i<gridSize; i++) {

			};
			break;
		case 2: //down
			for(var i = pos.y;i >= 0; i--) {

			};
			break;
		case 3: //left
			for(var i = pos.y;i >=0 ; i--) {

			};
			break;
	}
	//console.log("Tile at position ("+pos.x+","+pos.y+") is merging with tile at position ("+merge.x+","+merge.y+") and going to ("+newPos.x+","+newPos.y+")");
	return {newPos: newPos, mergeTarget: merge};
};

/*
	Generates a new tile at a random position and adds it to the grid
*/
Grid.prototype.generateTile = function() {
	this.newTile = new Tile(this.getRandomPosition(), Math.floor(Math.random()*2));
	this.insertTile(this.newTile);
};

/*
	Returns a new grid with an updated state
*/
Grid.prototype.update = function(dir) {
	var update;
	var self = this;
	this.moveMap = [];
	this.newTile = null;
	this.previousState = this.tiles;
	this.eachCell(function(x,y,tile) {
		if(tile) {
			update = self.getMovePosition({x:x, y:y}, dir);
			if(update.mergeTarget) {
				self.insertTile(new Tile(update.newPos, tile.level+1));
				self.moveMap.push({oldPos: {x:x, y:y}, newPos: update.newPos, level: tile.level+1});
			} else {
				self.moveMap.push({oldPos: {x:x, y:y}, newPos: update.newPos, level: tile.level});
			}
			self.removeTile(mergeTarget);
			self.removeTile(tile);
		};
	});
	if(this.differentState)
		this.generateTile();
	console.log(this.moveMap);
	console.log(this.tiles);
}

/*
	Returns true if the previous state is different from the current one.
*/
Grid.prototype.differentState = function() {
		
};

/*
	Returns a tuple {gameOver, gameState} of a boolean indicating if the game is over
	and a string indicating the state of the game (win or loss).
*/
Grid.prototype.gameOver = function() {
	var free = this.freePositions();
	var self = this;
	if(!free.length)
		return {gameOver: true, gameState: "loss"};
	else {
		this.eachCell(function(x,y,tile) {
			if(tile.level == 10)
				return {gameOver: true, gameState: "win"};
		});
	};
	return {gameOver: false, gameState: "live"};
};