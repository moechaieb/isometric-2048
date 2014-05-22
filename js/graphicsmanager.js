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
	For animations to work, the following must hold: refreshRate*(squareSide+space) must be an integer
*/
var squareSide = 1.6;
var gridSize = 4;
var thickness = 0.075;
var refreshRate = 4;
var elevation = 2;
var space = 0.4;
var center; //to be used later when implementing rotating the board
var viewAngle = 0; //to be used later when implementing rotating the board
var boardcolors = [new Color(64,64,64), new Color(0,0,0)];
var progression = [new Color(230,230,230), new Color(220,180,160), new Color(210,120,110), new Color(255,50,50),
			   	   new Color(255,0,0), new Color(255,255,150), new Color(255,230,110), new Color(255,210,50),
			       new Color(255,195,15), new Color(230,150,60), new Color(230,110,25)];

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
	return Shape.Prism(Point(tile.x*(squareSide+space)+space,tile.y*(squareSide+space)+space), squareSide, squareSide, thickness);
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
	//Animation phase 1: move all tiles to their positions and 'drop' new tile
	var id = setInterval(function() {
		self.iso.canvas.clear();
		self.drawBoard();
		for (var i = 0; i < gridCells.length; i++) {
			self.iso.add(tile3Ds[i].translate(dxs[i],dys[i],0), progression[gridCells[i].lvl]);
			dxs[i] += (newXs[i]-(gridCells[i].position.x))/refreshRate;
			dys[i] += (newYs[i]-(gridCells[i].position.y))/refreshRate;
		};
		if(grid.newTile) {
			self.iso.add(newTile.translate(0,0,elevation*(1-dn)), progression[grid.newTile.level]);
			dn += 1/(refreshRate*(squareSide+space));
		}
		if(c === refreshRate*(squareSide+space)){
			clearInterval(id);
		};
		c++;
	}, 1);
	//Animation phase 2: grow all tiles to their respective levels
};