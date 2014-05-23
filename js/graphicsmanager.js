/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*	Built with Isomer: http://jdan.github.io/isomer/
*
*****************************************************/

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

/*
	Convenient renames.
*/
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

/*
	Important constants.
	For animations to work, the following must hold: refreshRate*(squareSide+space) must be an integer
*/
var squareSide = 1.4;
var gridSize = 4;
var thickness = 0.075;
var refreshRate = 3;
var elevation = 3;
var space = 0.6;
var center; //to be used later when implementing rotating the board
var viewAngle = 0; //to be used later when implementing rotating the board
var boardcolors = [new Color(64,64,64), new Color(0,0,0)];
var progression = [new Color(230,230,230), new Color(220,180,160), new Color(210,120,110), new Color(255,70,70),
			   	   new Color(255,0,0), new Color(255,255,150), new Color(255,230,110), new Color(255,210,50),
			       new Color(255,195,15), new Color(230,150,60), new Color(230,110,25)];

/*
	Constucts a GraphicsManager object, wrapping an Isomer object
*/
function GraphicsManager(grid) {
	this.iso = new Isomer(document.getElementById("game"));
	this.grid = grid;
	this.dxs = [];
	this.dys = [];
	this.dn = 0;
	this.tile3Ds = [];
	this.refreshCounter = 1;
	this.keymanager = null;
};

/*
	Draws the board on which the tiles will move.
*/
GraphicsManager.prototype.drawBoard = function() {
	//add board
	this.iso.add(Shape.Prism(Point(-thickness,-thickness,0), 4*squareSide+5*space, 4*squareSide+5*space, thickness), boardcolors[1]);
	//initialize the squares
	for (var i = 3; i >= 0; i--) {
		for (var j = 3; j >= 0; j--) {
			this.iso.add(new Path([Point(i*(squareSide+space)+space, j*(squareSide+space)+space, 0), 
				Point(i*(squareSide+space)+space+squareSide, j*(space+squareSide)+space, 0),
				Point(i*(squareSide+space)+space+squareSide, j*(space+squareSide)+space+squareSide, 0),
				Point(i*(squareSide+space)+space, j*(space+squareSide)+squareSide+space, 0)]), boardcolors[0]);
		};
	};
};

/*
	Contructs a 3D tile representation of a tile object.
*/
GraphicsManager.prototype.makeTile3D = function(tile) {
	return Shape.Prism(Point(tile.x*(squareSide+space)+space,tile.y*(squareSide+space)+space), squareSide, squareSide, Math.pow(2, tile.level)*thickness);
};

/*
	Draws all tiles in the grid on the board.
*/
GraphicsManager.prototype.drawTiles = function(grid) {
	var self = this;
	this.iso.canvas.clear();
	this.drawBoard();
	grid.eachCell(null, function(x,y,tile) {
		if(tile)
			self.iso.add(self.makeTile3D(tile),progression[tile.level]);
	});
};

GraphicsManager.prototype.preUpdate = function() {
	for (var i = this.grid.moveMap.length-1; i >= 0; i--) {
		if(this.grid.moveMap[i]) {
			this.tile3Ds[i] = this.makeTile3D({x: this.grid.moveMap[i].oldPos.x, y: this.grid.moveMap[i].oldPos.y, level: this.grid.moveMap[i].level});
			this.dxs[i] = 0;
			this.dys[i] = 0;
		};	
	};
};

/*
	Dynamically updates the scene to the new state of the grid.
	TODO: optimize this
*/
GraphicsManager.prototype.updateScene = function() {
	var id = window.requestAnimationFrame(this.updateScene.bind(this));
	this.iso.canvas.clear();
	this.drawBoard();
	if(this.grid.newTile) {
		this.iso.add(this.makeTile3D(this.grid.newTile).translate(0,0,elevation*(1-this.dn)), progression[this.grid.newTile.level]);
		this.dn += 1/(refreshRate*(squareSide+space));
	};
	for (var i = this.grid.moveMap.length-1; i >= 0; i--) {
		if(this.grid.moveMap[i]) {
			this.iso.add(this.tile3Ds[i].translate(this.dxs[i],this.dys[i],0), progression[this.grid.moveMap[i].level]);
			this.dxs[i] += (this.grid.moveMap[i].newPos.x-(this.grid.moveMap[i].oldPos.x))/refreshRate;
			this.dys[i] += (this.grid.moveMap[i].newPos.y-(this.grid.moveMap[i].oldPos.y))/refreshRate;
		};
	};
	if(this.refreshCounter === refreshRate*(squareSide+space)+1) {
		this.refreshCounter = 0;
		this.dxs = [];
		this.dys = [];
		this.dn = 0;
		this.tile3Ds = [];
		this.keymanager.bind();
		window.cancelAnimationFrame(id);
	};
	this.refreshCounter++;
};

/*
	Draws the tile at the correct location (takes into account rotation angle)
	Parameters:
		- tile: a Tile object
		- translation: must be a tuple {x,y,z}
	TODO: implement this, replace all occurrences of iso.add with GraphicsManager.add
*/
GraphicsManager.prototype.add = function(tile, translation) {

};