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
	this.tiles = [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]];
	this.newTile = null;
};

/*
	Iterator for the tiles in the grid, applies the given function
	to all tiles in the grid. The order of iteration is decided by
	the direction parameter
*/
Grid.prototype.eachCell = function(dir, fun) {
	if(!dir || dir < 2) {
		for (var i = this.gridSize-1; i >= 0; i--) {
			for (var j = this.gridSize-1; j >= 0; j--) {
				fun(i, j, this.tiles[i][j]);
			};
		};
	} else {
		for (var i = 0; i < gridSize; i++) {
			for (var j = 0; j < gridSize; j++) {
				fun(i, j, this.tiles[i][j]);
			};
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
	this.eachCell(null, function(x,y,tile) {
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
	this.generateTile();
	this.generateTile();
	this.newTile = null;
};

/*
	Returns a tuple {newPos, merge} of the new position of the tile at the given
	position, and a boolean indicating if the tile merged.
*/
Grid.prototype.getMovePosition = function(pos, dir) {
	var merge = false;
	var newPos = {x:pos.x, y:pos.y};
	var inc = 1;
	switch(dir) {
		case 0: //up
			// Find the upmost valid position, then depending on the tile that's right after,
			// determine if you need to merge or not
			while(pos.y+inc < gridSize) {
				if(this.tiles[pos.x][pos.y+inc] == null)
					inc++;
				else break;
			};
			if(this.tiles[pos.x][pos.y+inc] == null) {
				newPos = {x:pos.x, y:pos.y+inc-1}
				break;
			} else if(this.tiles[pos.x][pos.y+inc]) {
				if(this.tiles[pos.x][pos.y+inc].level == this.tiles[pos.x][pos.y].level) {
					newPos = {x: pos.x, y: pos.y+inc};
					merge = true;
				} else newPos = {x: pos.x, y: pos.y+inc-1};
				break;
			};
			break;
		case 1: //right
			while(pos.x+inc < gridSize) {
				if(this.tiles[pos.x+inc][pos.y] == null)
					inc++;
				else break;
			};
			if(this.tiles[pos.x+inc] == null) {
				newPos = {x:pos.x+inc-1, y:pos.y}
				break;
			} else if(this.tiles[pos.x+inc][pos.y]) {
				if(this.tiles[pos.x+inc][pos.y].level == this.tiles[pos.x][pos.y].level) {
					newPos = {x: pos.x+inc, y: pos.y};
					merge = true;
				} else newPos = {x: pos.x+inc-1, y: pos.y};
				break;
			};
			break;
		case 2: //down
			while(pos.y-inc >= 0) {
				if(this.tiles[pos.x][pos.y-inc] == null)
					inc++;
				else break;
			};
			if(this.tiles[pos.x][pos.y-inc] == null) {
				newPos = {x:pos.x, y:pos.y-inc+1}
				break;
			} else if(this.tiles[pos.x][pos.y-inc]) {
				if(this.tiles[pos.x][pos.y-inc].level == this.tiles[pos.x][pos.y].level) {
					newPos = {x: pos.x, y: pos.y-inc};
					merge = true;
				} else newPos = {x: pos.x, y: pos.y-inc+1};
				break;
			};
			break;
		case 3: //left
			while(pos.x-inc >= 0) {
				if(this.tiles[pos.x-inc][pos.y] == null)
					inc++;
				else break;
			};
			if(this.tiles[pos.x-inc] == null) {
				newPos = {x:pos.x-inc+1, y:pos.y}
				break;
			} else if(this.tiles[pos.x-inc][pos.y]) {
				if(this.tiles[pos.x-inc][pos.y].level == this.tiles[pos.x][pos.y].level) {
					newPos = {x: pos.x-inc, y: pos.y};
					merge = true;
				} else newPos = {x: pos.x-inc+1, y: pos.y};
				break;
			};
			break;
	}
	return {newPos: newPos, merge: merge};
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
	this.eachCell(dir, function(x,y,tile) {
		if(tile) {
			update = self.getMovePosition({x:x, y:y}, dir);
			if(update.merge) {
				self.removeTile(tile);
				self.insertTile(new Tile(update.newPos, tile.level+1));
				self.moveMap.push({oldPos: {x:x, y:y}, newPos: update.newPos, level: tile.level+1});
			} else {
				self.updateTile(tile, update.newPos)
				self.moveMap.push({oldPos: {x:x, y:y}, newPos: update.newPos, level: tile.level});
			};
		};
	});
	if(this.differentState())
		this.generateTile();
	else this.newTile = null;
}

/*
	Returns true if the previous state is different from the current one.
*/
Grid.prototype.differentState = function() {
	// Check where all the tiles in the movement map are going, if they're staying in place,
	// then the state is the same
	for (var i = 0; i < this.moveMap.length; i++) {
		if(this.moveMap[i]) {
			if(this.moveMap[i].oldPos.x != this.moveMap[i].newPos.x || this.moveMap[i].oldPos.y != this.moveMap[i].newPos.y)
				return true;
		}
	};
	return false;
};

/*
	TODO: implement this
*/
Grid.prototype.gameOver = function() {
	
};