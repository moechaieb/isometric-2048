/*****************************************************
*
*	Designed and programmed by Mohamed Adam Chaieb.
*
*****************************************************/

function KeyManager(g, grid) {
	this.graphicsManager = g;
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
};