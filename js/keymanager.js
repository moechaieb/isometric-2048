/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
*****************************************************/

function KeyManager(gpx, grid) {
	this.graphicsManager = gpx;
	this.gameGrid = grid;
	this.bind();
}

/*
	Binds keys to key listeners.
*/
KeyManager.prototype.bind = function () {
	var self = this;
	$(document).keydown(function(e) {
		switch(e.keyCode) {
			case 38://up
				self.trigger(0);
				break;
			case 39://right
				self.trigger(1);
				break;
			case 40://down
				self.trigger(2);
				break;
			case 37://left
				self.trigger(3);
				break;
		};
	});
};

/*
	This function is triggered when a key is pressed.
*/
KeyManager.prototype.trigger = function(n) {
	this.gameGrid.update(n);
	this.graphicsManager.updateScene(this.gameGrid);
	this.updateScore();
};

/*
	Updates the score on the screen
*/
KeyManager.prototype.updateScore = function() {
	var score = document.getElementsByClassName('score')[0];
	score.innerHTML = "Score: "+this.gameGrid.score;
};