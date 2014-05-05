/*****************************************************
*	Designed and programmed by Mohamed Adam Chaieb.
*****************************************************/

function KeyManager(g, grid) {
	this.graphicsManager = g;
	this.gameGrid = grid;
	
	var self = this;
	//initialize key listeners
	this.bind = function () {
		Mousetrap.bind(['up', 'w'], function() {self.trigger(0);});
		Mousetrap.bind(['down', 's'], function() {self.trigger(2);});
		Mousetrap.bind(['left', 'a'], function() {self.trigger(3);});
		Mousetrap.bind(['right', 'd'], function() {self.trigger(1);});	
	};

	this.bind();

	this.trigger = function(n) {
		this.gameGrid.update(n);
		this.graphicsManager.updateScene(this.gameGrid);
		//console.log(this.gameGrid);
	};
}