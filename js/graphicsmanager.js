/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*	Built with Isomer: http://jdan.github.io/isomer/
*
*****************************************************/

/*
	Convenient renames.
*/
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

/*
	Important constants.
*/
var squareSide = 2;
var gridSize = 4;
var thickness = 0.15;
var refreshRate = 4;
var space = 0.2;
var boardcolors = [new Color(32,32,32), new Color(0,0,0)];
var progression = [new Color(255,255,255), new Color(221,178,152), new Color(205,115,104), new Color(255,84,63),
			   	   new Color(111,225,118), new Color(71,63,189), new Color(95,241,124), new Color(0,249,138),
			       new Color(0,249,255), new Color(208,21,139), new Color(95,241,9)];

/*
	Constucts a GraphicsManager object, wrapping an Isomer object
*/
function GraphicsManager() {
	this.iso = new Isomer(document.getElementById("game"));
};

/*
	Draws the board on which the tiles will move.
*/
GraphicsManager.prototype.drawBoard = function() {
	//add board
	this.iso.add(Shape.Prism(Point(0-thickness,0-thickness,0), 4*squareSide+5*space, 4*squareSide+5*space, thickness), boardcolors[1]);
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
	return Shape.Prism(Point(tile.x*(squareSide+space)+space,tile.y*(squareSide+space)+space), squareSide, squareSide, thickness);
};

/*
	Draws all tiles in the grid on the board.
*/
GraphicsManager.prototype.drawTiles = function(grid) {
	var self = this;
	this.iso.canvas.clear();
	this.drawBoard();
	grid.eachCell(function(x,y,tile) {
		if(tile)
			self.iso.add(self.makeTile3D(tile),progression[tile.level]);
	});
};

/*
	Dynamically updates the scene to the new state of the grid.
*/
GraphicsManager.prototype.updateScene = function(grid) {
	var self = this;
	var dxs = [];
	var dys = [];
	var tile3Ds = [];
	var newXs = [];
	var newYs = [];
	var gridCells = [];
	var c = 0;
	if(grid.newTile) {
		var newTile = this.makeTile3D(grid.newTile);
		var dn = 0;
	}
	for (var i = 0; i < grid.moveMap.length; i++) {
		if(grid.moveMap[i]) {
			gridCells.push({position: grid.moveMap[i].oldPos, lvl : grid.moveMap[i].level});
			newXs.push(grid.moveMap[i].newPos.x);
			newYs.push(Math.floor(grid.moveMap[i].newPos.y));
			tile3Ds[i] = this.makeTile3D({x: gridCells[i].position.x, y: gridCells[i].position.y});
			dxs[i] = 0;
			dys[i] = 0;
		};	
	};
	var id = setInterval(function() {
		self.iso.canvas.clear();
		self.drawBoard();
		for (var i = 0; i < gridCells.length; i++) {
			self.iso.add(tile3Ds[i].translate(dxs[i],dys[i],0), progression[gridCells[i].lvl]);
			dxs[i] += (newXs[i]-(gridCells[i].position.x))/refreshRate;
			dys[i] += (newYs[i]-(gridCells[i].position.y))/refreshRate;
		};
		if(grid.newTile) {
			// self.iso.add(newTile.translate(0,0,3-3*dn), progression[grid.newTile.level]);
			// dn += 1/(refreshRate*squareSide);
		}
		if(c === refreshRate*squareSide){
			clearInterval(id);
		};
		c++;
	}, 1);
};