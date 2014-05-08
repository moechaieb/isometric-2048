/*****************************************************
*	Designed and programmed by Mohamed Adam Chaieb.
******************************************************/

/*
	
*/
function Grid() {
	this.gridSize = 4;
	this.moveMap = [];
	this.tiles = [[null, null, null, null],
				  [null, null, null, null],
				  [null, null, null, null],
				  [null, null, null, null]];
	this.previousState = [];
	this.newTile = null;
};

/*
	Iterator for the tiles in the grid
*/
Grid.prototype.eachCell = function(fun) {
	for (var i = 0; i < this.gridSize; i++) {
		for (var j = 0; j < this.gridSize; j++) {
			fun(i, j, this.tiles[i][j]);
		};
	};
};

/*
	
*/
Grid.prototype.cellOccupied = function(pos) {
	return this.tiles[pos] == null;
};

/*
	
*/
Grid.prototype.insertTile = function(tile) {
	this.tiles[tile.x][tile.y] = tile;
};

/*
	
*/
Grid.prototype.removeTile = function(tile) {
	this.tiles[tile.x][tile.y] = null;
};

/*

*/
Grid.prototype.freePositions = function() {
	var free = [];

};

/*
	Returns a random empty position
*/
Grid.prototype.getRandomPosition = function() {
	return {x: 0, y: 0};
};

/*
	
*/
Grid.prototype.init = function() {
	//add two tiles at random positions
	this.insertTile(new Tile(this.getRandomPosition(), Math.floor(Math.random()*2)));
	this.insertTile(new Tile(this.getRandomPosition(), Math.floor(Math.random()*2)));
};

/*
	
*/
Grid.prototype.getMovePosition = function(pos, dir) {
	
};

/*
	Generates a new tile at a random position and adds it to the grid
*/
Grid.prototype.generateTile = function() {
	this.newTile = new Tile(this.getRandomPosition(), Math.floor(Math.random()*2));
	this.insertTile(this.newTile);
};

/*
	Returns null if the cell doesn't merge, or returns a tuple {mergeWith, mergePos} of 
	he cell with which it merges and the position that it will land in
*/
Grid.prototype.getMergeTarget = function(pos, dir) {
	
};

/*
	Returns a new grid with an updated state
*/
Grid.prototype.update = function(dir) {
	var newPos;
	var mergeTarget;
	this.moveMap = [];
	this.newTile = null;
}

/*
*	Helper method, returns true if two tile arrays are equal, false otherwise
*/
var arrayEquals = function(a1, a2) {
	for(var i = 0; i<a1.length;i++) {
		if((a1[i] == null && a2[i] != null) || ((a2[i] == null && a1[i] != null)))
			return false;
	};
	return true;
}