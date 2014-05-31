/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
*****************************************************/

function Game() {
	globalGame = this;
	this.gridSize = 4;
	this.grid = new Grid();
	this.graphicsManager = new GraphicsManager();
	this.inputManager = new InputManager();
	this.grid.init();
	this.graphicsManager.drawBoard();
	this.graphicsManager.drawTiles();
};

/*
	This function executes once the game is over.
*/
Game.prototype.gameOverHandler = function() {
	var self = this;
	var $gameOverFrame;
	if(!this.grid.done) {
		$gameOverFrame = $("<div class='gameOver'><h1>Game Over!</h1><p>Score: "+this.grid.score+"</p><p class='b'>New Game</p></div>");
		$(".main").append($gameOverFrame);
		$(".gameOver .b").click(function() {
			$gameOverFrame.fadeOut(null, function() {
				$gameOverFrame.remove();
			}); 
			globalGame.reset(); 
			$(".score").html("Score: 0");
			$(".rotate, .newgame, .score").fadeIn();
		});
		$gameOverFrame.delay(2000).fadeIn(1000);
		$(".rotate, .newgame, .score").delay(1000).fadeOut(1000);
	} else {
		$gameOverFrame = $("<div class='gameOver'><h1>Congrats!</h1><p>You achieved the 2048 tile!</p><p class='b'>Keep Playing</p></div>");
		$(".main").append($gameOverFrame);
		$(".gameOver .b").click(function() {
			$gameOverFrame.fadeOut(null, function() {
				$gameOverFrame.remove();
			});
			$(".rotate, .newgame, .score").fadeIn();
			self.inputManager.bind();
			globalGame.grid.done = false;
		});
		$gameOverFrame.delay(2000).fadeIn(1000);
		$(".rotate, .newgame, .score").delay(1000).fadeOut(1000);
	};
};

/*
	Resets the game state. This prevents having to create multiple Game objects.
*/
Game.prototype.reset = function() {
	this.grid = new Grid();
	this.grid.init();
	this.graphicsManager.drawBoard();
	this.graphicsManager.drawTiles();
	this.inputManager.bind();
};