/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
*****************************************************/

/*
	Constructs a new tile.
*/
function Tile(position, level) {
	this.x = position.x;
	this.y = position.y;
	this.level = level;
	this.previousPosition = null;
};

/*
	Updates the position of the tile.
*/
Tile.prototype.updatePosition = function(position) {
	this.previousPosition = {x: this.x, y: this.y};
	this.x = position.x;
	this.y = position.y;
};