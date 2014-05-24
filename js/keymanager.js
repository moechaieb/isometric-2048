/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
*****************************************************/

/*
	Constructs a new InputManager object.
*/
function InputManager(gpx, grid) {
	this.graphicsManager = gpx;
	this.gameGrid = grid;
	this.bind();
}

/*
	Binds the key handler to the 'keydown' event.
*/
InputManager.prototype.bind = function() {
	var self = this;
	Mousetrap.bind(['up', "w"], function() {self.update(0);});
	Mousetrap.bind(['right', "d"], function() {self.update(1);});
	Mousetrap.bind(['down', "s"], function() {self.update(2);});
	Mousetrap.bind(['left', "a"], function() {self.update(3);});
	Mousetrap.bind(['enter', "space"], function() {self.rotate()});
	$(".rotate").click(function() {self.rotate()});
	$(".newGame").click(function() {new Game(); $(".score").html("Score: 0");});
};

InputManager.prototype.unbind = function() {
	Mousetrap.reset();
	$(".rotate").unbind();
	$(".newGame").unbind();
	//unbind rotation buttons
};

/*
	This function is triggered when a key is pressed.
*/
InputManager.prototype.update = function(n) {
	this.gameGrid.update(n);
	if(this.gameGrid.differentState()) {
		this.unbind();
		this.graphicsManager.preUpdate();
		this.graphicsManager.updateScene();
	};
	this.updateScore();

};

/*
	Triggers the rotation animation. 0 is left, 1 is right.
*/
InputManager.prototype.rotate = function() {
	this.unbind();
	//determine the angle based on direction first
	this.graphicsManager.preRotate();
	this.graphicsManager.rotateScene();
};

/*
	Updates the score on the screen
*/
InputManager.prototype.updateScore = function() {
	$(".score").html("Score: "+this.gameGrid.score);
};