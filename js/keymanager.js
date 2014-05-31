/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
*****************************************************/

/*
	Constructs a new InputManager object.
*/
function InputManager() {
	this.bind();
};

/*
	Binds the input handlers.
*/
InputManager.prototype.bind = function() {
	var self = this;
	Mousetrap.bind(['up', "w"], function() {self.update(0);});
	Mousetrap.bind(['right', "d"], function() {self.update(1);});
	Mousetrap.bind(['down', "s"], function() {self.update(2);});
	Mousetrap.bind(['left', "a"], function() {self.update(3);});
	Mousetrap.bind(['enter', "space"], function() {self.rotate()});
	$(".rotate").click(function() {self.rotate()});
	$(".newGame").click(function() {globalGame.reset(); $(".score").html("Score: 0");});
};

/*
	Unbinds input handlers.
*/
InputManager.prototype.unbind = function() {
	Mousetrap.reset();
	$(".rotate").unbind();
	$(".newGame").unbind();
};

/*
	This function is triggered when a key is pressed.
*/
InputManager.prototype.update = function(n) {
	globalGame.grid.update(n);
	if(globalGame.grid.differentState()) {
		this.unbind();
		globalGame.graphicsManager.preUpdate();
		globalGame.graphicsManager.updateScene();
	};
	this.updateScore();

};

/*
	Triggers the rotation animation. 0 is left, 1 is right.
*/
InputManager.prototype.rotate = function() {
	this.unbind();
	//determine the angle based on direction first
	globalGame.graphicsManager.preRotate();
	globalGame.graphicsManager.rotateScene();
};

/*
	Updates the score on the screen
*/
InputManager.prototype.updateScore = function() {
	$(".score").html("Score: "+globalGame.grid.score);
};