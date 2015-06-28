var PIXI = require('pixi.js');
var globals = require('../globals');
module.exports = {
	number: 4,
	name: 'Laboratory',
	display: function() {
		var graphics = new PIXI.Graphics();
		graphics.beginFill(0xFFFF00);
		// set the line style to have a width of 5 and set the color to red
		graphics.lineStyle(5, 0xFF0000);
		// draw a rectangle
		graphics.drawRect(0, 0, globals.node.size.width-5, globals.node.size.height-5);
		return graphics;
	},
	root:{
		name: '/',
		items: [],
		children: [], // nodes go here
		itemsVisible: true,
		messages: []
	}
}

