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
	Mousetrap.bind(['up', 'w'], function() {self.trigger(0);});
	Mousetrap.bind(['down', 's'], function() {self.trigger(2);});
	Mousetrap.bind(['left', 'a'], function() {self.trigger(3);});
	Mousetrap.bind(['right', 'd'], function() {self.trigger(1);});	
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