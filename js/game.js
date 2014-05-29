/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
*****************************************************/

function Game() {
	var gridSize = 4;
	this.grid = new Grid();
	this.graphicsManager = new GraphicsManager(this.grid);
	this.inputManager = new InputManager(this.graphicsManager, this.grid);
	this.graphicsManager.inputmanager = this.inputManager;
	this.grid.init();
	this.graphicsManager.drawBoard();
	this.graphicsManager.drawTiles(this.grid);
	globalGame = this;
};

/*
	This function executes once the game is over.
*/
Game.prototype.gameOverHandler = function() {
	var $gameOverFrame = $("<div class='gameOver'><h1>Game Over!</h1><p>Score: "+this.grid.score+"</p><a>New Game</a></div>");
	$(".main").append($gameOverFrame);
	$(".gameOver a").click(function() {
		$gameOverFrame.fadeOut(null, function() {
			$gameOverFrame.remove();
		}); 
		new Game(); 
		$(".score").html("Score: 0");
		$(".rotate, .newgame, .score").fadeIn();
	});
	$gameOverFrame.delay(2000).fadeIn(1000);
	$(".rotate, .newgame, .score").delay(1000).fadeOut(1000);
};