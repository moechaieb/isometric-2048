/*****************************************************
*	Designed and programmed by Mohamed Adam Chaieb.
*****************************************************/

function Game() {
	var gridSize = 4;
	this.grid = new Grid();
	this.grid.init();
	this.graphicsManager = new GraphicsManager();
	this.graphicsManager.drawBoard();
	this.graphicsManager.drawTiles(this.grid);
	this.keyManager = new KeyManager(this.graphicsManager, this.grid);
}