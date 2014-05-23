/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
*****************************************************/

/*
	Constructs a new KeyManager object.
*/
function KeyManager(gpx, grid) {
	this.graphicsManager = gpx;
	this.gameGrid = grid;
	this.bind();
}

/*
	Binds the key handler to the 'keydown' event.
*/
KeyManager.prototype.bind = function() {
	console.log("BINDED")
	var self = this;
	Mousetrap.bind(['up', "w"], function() {self.update(0);});
	Mousetrap.bind(['right', "d"], function() {self.update(1);});
	Mousetrap.bind(['down', "s"], function() {self.update(2);});
	Mousetrap.bind(['left', "a"], function() {self.update(3);});
};

/*
	This function is triggered when a key is pressed.
*/
KeyManager.prototype.update = function(n) {
	var self = this;
	this.gameGrid.update(n);
	if(this.gameGrid.differentState()) {
		Mousetrap.reset();
		this.graphicsManager.preUpdate();
		this.graphicsManager.updateScene();
	};
	this.updateScore();

};

/*
	Updates the score on the screen
*/
KeyManager.prototype.updateScore = function() {
	var score = document.getElementsByClassName('score')[0];
	score.innerHTML = "Score: "+this.gameGrid.score;
};