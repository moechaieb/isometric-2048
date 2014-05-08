/*****************************************************
*	Designed and programmed by Mohamed Adam Chaieb.
*****************************************************/

//constructor for tiles
function Tile(position, level) {
	this.x = position.x;
	this.y = position.y;
	this.level = level;
	this.mergedFrom = null;
	this.previousPosition = null;
};

//add state-updating functionality
Tile.prototype.updatePosition = function(position) {
	this.previousPosition = {x: this.x, y: this.y};
	this.x = position.x;
	this.y = position.y;
};