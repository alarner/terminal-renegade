var PIXI = require('pixi.js');
var globals = require('../globals');
module.exports = {
	defaultNodeDisplay: function() {
		var graphics = new PIXI.Graphics();
		graphics.beginFill(0xFFFF00);
		// set the line style to have a width of 5 and set the color to red
		graphics.lineStyle(5, 0xFF0000);
		// draw a rectangle
		graphics.drawRect(0, 0, globals.node.size.width, globals.node.size.height);
		return graphics;
	},
	root:{
		name: '/',
		items: [],
		children: [
			{
				name: 'usr',
				items: [],
				children: [
					{
						name: 'a',
						items: [],
						children: [
							
						], // nodes go here
						spawnRates: {},
						visible: true,
						messages: []
					},
					{
						name: 'b',
						items: [],
						children: [
							
						], // nodes go here
						spawnRates: {},
						visible: true,
						messages: []
					}
				], // nodes go here
				spawnRates: {},
				visible: true,
				messages: []
			},
			{
				name: 'var',
				display: function() {
					var graphics = new PIXI.Graphics();
					graphics.beginFill(0xFF0000);
					// set the line style to have a width of 5 and set the color to red
					graphics.lineStyle(5, 0xFF0000);
					// draw a rectangle
					graphics.drawRect(0, 0, globals.node.size.width, globals.node.size.height);
					return graphics;
				},
				items: [],
				children: [
					
				], // nodes go here
				spawnRates: {},
				visible: true,
				messages: []
			}
		], // nodes go here
		spawnRates: {},
		visible: true,
		messages: []
	}
}

