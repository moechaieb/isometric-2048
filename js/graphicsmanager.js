/*****************************************************
*	Designed and programmed by Mohamed Adam Chaieb.
*****************************************************/

// Some convenient renames and constants
var Point = Isomer.Point;
var Path = Isomer.Path;
var Shape = Isomer.Shape;
var Color = Isomer.Color;

//some constants
var squareSide = 2.2;
var gridSize = 4;
var thickness = 0.15;
var refreshRate = 5;
var boardcolors = [new Color(32,32,32), new Color(0,0,0)]; (71,63,189)
var progression = [new Color(255,255,255), new Color(221,178,152), new Color(205,115,104), new Color(255,84,63),
			   	   new Color(111,225,118), new Color(71,63,189), new Color(95,241,124), new Color(0,249,138),
			       new Color(0,249,255), new Color(208,21,139), new Color(95,241,9)];

function GraphicsManager() {
	this.iso = new Isomer(document.getElementById("game"));

	this.drawNewTile = function(grid) {
		// var refreshes = 10;
		// var shape = this.makeTile3D(grid.newTile).translate(0,0,2);
		// var d = 0; 
		// var self = this;
		// var c = 0;
		// var id = setInterval(function() {
		// 	self.iso.canvas.clear();
		// 	self.drawTiles(grid);
		// 	self.iso.add(shape.translate(0,0,d), progression[grid.newTile.level]);
		// 	d -= 2/refreshes;
		// 	if(c == refreshes)
		// 		clearInterval(id);
		// 	c++;
		// }, 1);
	};
};

GraphicsManager.prototype.drawBoard = function() {
	//add board
	this.iso.add(Shape.Prism(Point(0-thickness,0-thickness,0), 4*squareSide, 4*squareSide, thickness));
	//initialize the squares
	for (var i = 3; i >= 0; i--) {
		for (var j = 3; j >= 0; j--) {
			this.iso.add(new Path([Point(i*squareSide, j*squareSide, 0), 
				Point(i*squareSide+squareSide, j*squareSide, 0),
				Point(i*squareSide+squareSide, j*squareSide+squareSide, 0),
				Point(i*squareSide, j*squareSide+squareSide, 0)]), boardcolors[(i+j)%2]);
		};
	};
};

GraphicsManager.prototype.makeTile3D = function(tile) {
	return Shape.Prism(Point(tile.x*squareSide,tile.y*squareSide), squareSide, squareSide, thickness);
};

GraphicsManager.prototype.drawTiles = function(grid) {
	var self = this;
	this.iso.canvas.clear();
	this.drawBoard();
	grid.eachCell(function(x,y,tile) {
		if(tile)
			self.iso.add(self.makeTile3D(tile),progression[tile.level]);
	});
};

// dynamically moves tiles in the movement map to their new positions
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
			dxs[i] += (newXs[i]-(gridCells[i].index%gridSize))/refreshRate;
			dys[i] += (newYs[i]-(Math.floor(gridCells[i].index/gridSize)))/refreshRate;
		};
		if(grid.newTile) {
			self.iso.add(newTile.translate(0,0,3-3*dn), progression[grid.newTile.level]);
			dn += 1/(refreshRate*squareSide);
		}
		if(c === refreshRate*squareSide){
			clearInterval(id);
		};
		c++;
	}, 2);
	//add the new tile, if there is one
};