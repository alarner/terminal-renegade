var PIXI = require('pixi.js');
var globals = require('../globals');
module.exports = {
	display: function() {
		// var graphics = new PIXI.Graphics();
		// graphics.beginFill(0xFFFF00);
		// // set the line style to have a width of 5 and set the color to red
		// graphics.lineStyle(5, 0xFF0000);
		// // draw a rectangle
		// graphics.drawRect(0, 0, globals.node.size.width-5, globals.node.size.height-5);
		// return graphics;
		var texture = PIXI.Texture.fromImage("../images/bunny.gif");
		    // create a new Sprite using the texture
		var bunny = new PIXI.Sprite(texture);

		bunny.anchor.x = 0.5;
		bunny.anchor.y = 0.5;

		// move the sprite to the center of the screen
		bunny.position.x = 200;
		bunny.position.y = 200;

		bunny.scale.x = 0.5;
		bunny.scale.y = 0.5;

		return bunny;
	},
	root:{
		name: '/',

		display: function() {
			var parentTexture = PIXI.Texture.fromImage('../images/dwarf-face.png');
			var parent = new PIXI.Sprite(parentTexture);
			parent.anchor.x = 0;
			parent.anchor.y = 0;
			parent.position.x = 200;
			parent.position.y = 200;
			parent.scale.x = 0.2;
			parent.scale.y = 0.2;
			return parent;
		},

		items: [],
		children: [
			{
				name: 'usr',

				display: function() {
					var firstChildTexture = PIXI.Texture.fromImage('../images/drink-me.png');
					var childOfParent = new PIXI.Sprite(firstChildTexture);
					childOfParent.anchor.x = 0;
					childOfParent.anchor.y = 0;
					childOfParent.position.x = 200;
					childOfParent.position.y = 200;
					childOfParent.scale.x = 0.2;
					childOfParent.scale.y = 0.2;
					return childOfParent;
				},

				items: [],
				children: [
					{
						name: 'a',

						display: function() {
							var childATexture = PIXI.Texture.fromImage('../images/mouth-watering.png');
							var childA = new PIXI.Sprite(childATexture);
							childA.anchor.x = 0;
							childA.anchor.y = 0;
							childA.position.x = 200;
							childA.position.y = 200;
							childA.scale.x = 0.2;
							childA.scale.y = 0.2;
							return childA;
						},

						items: [],
						children: [
							
						], // nodes go here
						itemsVisible: true,
						messages: []
					},
					{
						name: 'b',

						display: function() {
							var childBTexture = PIXI.Texture.fromImage('../images/bugle-call.png');
							var childB = new PIXI.Sprite(childBTexture);
							childB.anchor.x = 0;
							childB.anchor.y = 0;
							childB.position.x = 200;
							childB.position.y = 200;
							childB.scale.x = 0.2;
							childB.scale.y = 0.2;
							return childB;
						},

						items: [],
						children: [
							
						], // nodes go here
						itemsVisible: true,
						messages: []
					}
				], // nodes go here
				itemsVisible: true,
				messages: []
			},
			{
				name: 'var',

				display: function() {
					var graphics = new PIXI.Graphics();
					graphics.beginFill(0xFF00FF);
					// set the line style to have a width of 5 and set the color to red
					graphics.lineStyle(5, 0xFF0000);
					// draw a rectangle
					graphics.drawRect(0, 0, globals.node.size.width-5, globals.node.size.height-5);
					return graphics;
				},

				display: function() {
					var paranoiaTexture = PIXI.Texture.fromImage('../images/paranoia.png');
					var paranoia = new PIXI.Sprite(paranoiaTexture);
					paranoia.anchor.x = 0;
					paranoia.anchor.y = 0;
					paranoia.position.x = 200;
					paranoia.position.y = 200;
					paranoia.scale.x = 0.2;
					paranoia.scale.y = 0.2;
					return paranoia;
				},
				items: [
				],
				children: [
					
				], // nodes go here
				itemsVisible: true,
				messages: []
			}
		], // nodes go here
		itemsVisible: true,
		messages: []
	}
}

// items are like icons