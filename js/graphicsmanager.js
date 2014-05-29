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
var squareSide = 1.3;
var gridSize = 4;
var thickness = 0.1;
var refreshRate = 3.5;
var elevation = 3;
var space = 0.7;
var center = Point(2*squareSide+2.5*space, 2*squareSide+2.5*space, 0); //to be used later when implementing rotating the board
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
	this.angle = 0;
};

/*
	Draws the board on which the tiles will move.
*/
GraphicsManager.prototype.drawBoard = function() {
	//add board
	this.add(Shape.Prism(Point(-thickness,-thickness,0), gridSize*squareSide+(gridSize+1)*space, gridSize*squareSide+(gridSize+1)*space, thickness), null, boardcolors[1]);
	//initialize the squares
	for (var i = gridSize-1; i >= 0; i--) {
		for (var j = gridSize-1; j >= 0; j--) {
			this.add(new Path([Point(i*(squareSide+space)+space, j*(squareSide+space)+space, 0), 
				Point(i*(squareSide+space)+space+squareSide, j*(space+squareSide)+space, 0),
				Point(i*(squareSide+space)+space+squareSide, j*(space+squareSide)+space+squareSide, 0),
				Point(i*(squareSide+space)+space, j*(space+squareSide)+squareSide+space, 0)]), null, boardcolors[0]);
		};
	};
};

/*
	Contructs a 3D tile representation of a tile object.
*/
GraphicsManager.prototype.makeTile3D = function(tile) {
	return Shape.Prism(Point(tile.x*(squareSide+space)+space,tile.y*(squareSide+space)+space), squareSide, squareSide, Math.pow(1.75, tile.level)*thickness);
};

/*
	Draws all tiles in the grid on the board.
*/
GraphicsManager.prototype.drawTiles = function() {
	var self = this;
	this.iso.canvas.clear();
	this.drawBoard();
	this.grid.eachCell(null, function(x,y,tile) {
		if(tile)
			self.add(self.makeTile3D(tile), null, progression[tile.level]);
	});
};

/*
	Prepares structures for updateScene method. Must be called before updateScene()!
*/
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
		this.add(this.makeTile3D(this.grid.newTile), {x:0, y:0,z: elevation*(1-this.dn)}, progression[this.grid.newTile.level]);
		this.dn += 1/(refreshRate*(squareSide+space));
	};
	for (var i = this.grid.moveMap.length-1; i >= 0; i--) {
		if(this.grid.moveMap[i]) {
			this.add(this.tile3Ds[i],{x:this.dxs[i], y:this.dys[i], z:0}, progression[this.grid.moveMap[i].level]);
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
		this.drawTiles();
		if(!this.grid.gameOver())
			this.inputmanager.bind();
		window.cancelAnimationFrame(id);
	};
	this.refreshCounter++;
};

/*
	Prepares the structures before rotating the scene. Must be called before rotateScene()!
*/
GraphicsManager.prototype.preRotate = function(dir) {
	this.dn = Math.PI/(refreshRate*12);
};

/*
	Rotates the scene to the right or left and then back to its initial position.
*/
GraphicsManager.prototype.rotateScene = function() {
	var id = window.requestAnimationFrame(this.rotateScene.bind(this));
	this.iso.canvas.clear();
	this.angle += this.dn;
	this.drawBoard();
	this.drawTiles();
	if(this.refreshCounter === refreshRate*24) {
		this.inputmanager.bind();
		this.refreshCounter = 0;
		this.dn = 0;
		window.cancelAnimationFrame(id);
	};
	this.refreshCounter++;
};

/*
	Draws the tile at the correct location (takes into account rotation angle)
	Parameters:
		- tile: a Tile object
		- translation: must be a tuple {x,y,z}
		- rotation: rotation must be an angle, in Radian
		- color: an Isomer color object
*/
GraphicsManager.prototype.add = function(shape, translation, color) {
	if(!translation)
		this.iso.add(shape.rotateZ(center, this.angle), color);
	else this.iso.add(shape.rotateZ(center, this.angle).translate(translation.x, translation.y, translation.z), color);
};