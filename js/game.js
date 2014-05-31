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
	this.graphicsManager.drawTiles(this.grid);
	console.log(globalGame);
};

/*
	This function executes once the game is over.
*/
Game.prototype.gameOverHandler = function() {
	var self = this;
	if(!this.grid.done) {
		var $gameOverFrame = $("<div class='gameOver'><h1>Game Over!</h1><p>Score: "+this.grid.score+"</p><p class='b'>New Game</p></div>");
		$(".main").append($gameOverFrame);
		$(".gameOver .b").click(function() {
			$gameOverFrame.fadeOut(null, function() {
				$gameOverFrame.remove();
			}); 
			new Game(); 
			$(".score").html("Score: 0");
			$(".rotate, .newgame, .score").fadeIn();
		});
		$gameOverFrame.delay(2000).fadeIn(1000);
		$(".rotate, .newgame, .score").delay(1000).fadeOut(1000);
	} else {
		console.log(this.grid.done);
		var $congratsFrame = $("<div class='gameOver'><h1>Congrats!</h1><p>You achieved the 2048 tile!</p><p class='b'>Keep Playing</p></div>");
		$(".main").append($congratsFrame);
		$(".gameOver .b").click(function() {
			$congratsFrame.fadeOut(null, function() {
				$congratsFrame.remove();
			});
			$(".rotate, .newgame, .score").fadeIn();
			self.inputManager.bind();
		});
		$congratsFrame.delay(2000).fadeIn(1000);
		$(".rotate, .newgame, .score").delay(1000).fadeOut(1000);
	};
};