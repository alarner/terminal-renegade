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
		var texture = PIXI.Texture.fromImage("../images/active_node.png");
		//var paranoiaTexture = PIXI.Texture.fromImage('../images/paranoia.png');
		    // create a new Sprite using the texture
		var sprite = new PIXI.Sprite(texture);
		//var paranoia = new PIXI.Sprite(paranoiaTexture);
		console.log(this);

		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;

		// paranoia.anchor.x = 0.5;
		// paranoia.anchor.y = 0.5;

		// // move the sprite to the center of the screen
		// sprite.position.x = 200;
		// sprite.position.y = 200;

		// paranoia.position.x = 200;
		// paranoia.position.y = 200;


		sprite.width = globals.node.size.width;
		sprite.height = globals.node.size.height;

		// sprite.scale.x = 0.2;
		// sprite.scale.y = 0.2; 

		return sprite
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
						itemsVisible: true,
						messages: []
					},
					{
						name: 'b',
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

				// var paranoiaTexture = PIXI.Texture.fromImage('../images/paranoia.png');
    // 			var paranoia = new PIXI.Sprite(paranoiaTexture);

				// display: function() {
				// 	var graphics = new PIXI.Graphics();
				// 	graphics.beginFill(0xFF00FF);
				// 	// set the line style to have a width of 5 and set the color to red
				// 	graphics.lineStyle(5, 0xFF0000);
				// 	// draw a rectangle
				// 	graphics.drawRect(0, 0, globals.node.size.width-5, globals.node.size.height-5);
				// 	return graphics;
				// },
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