/*****************************************************
*	Designed and programmed by Mohamed Adam Chaieb.
*****************************************************/

function Game() {
	var gridSize = 4;
	this.grid = new Grid();
	this.graphicsManager = new GraphicsManager();
	this.keyManager = new KeyManager(this.graphicsManager, this.grid);
	
	this.grid.init();
	this.graphicsManager.drawBoard();
	this.graphicsManager.drawTiles(this.grid);
}