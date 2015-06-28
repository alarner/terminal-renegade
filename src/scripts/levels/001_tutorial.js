var PIXI = require('pixi.js');
var globals = require('../globals');
module.exports = {
	display: function() {
		var container = new PIXI.Container();
		var texture;

		if(this.created) {
			if(this.type === 'file') {
				texture = PIXI.Texture.fromImage("../images/file_active.png");
			}
			else if(this.type === 'directory') {
				texture = PIXI.Texture.fromImage("../images/active_node.png");
			}
		}
		else {
			if(this.type === 'file') {
				texture = PIXI.Texture.fromImage("../images/file_inactive.png");
			}
			else if(this.type === 'directory') {
				texture = PIXI.Texture.fromImage("../images/inactive_node.png");
			}
		}
		var sprite = new PIXI.Sprite(texture);
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;

		container.addChild(sprite);

		var textParams = {
			font : '18px Orbitron',
			align : 'center',
			fill: 0x0DC1BC
		};
		if(!this.created) {
			textParams.fill = 0xD9D6D2;
		}
		if(this.type === 'file') {
			textParams.font = '14px Orbitron';
		}
		var text = new PIXI.Text(
			this.name,
			textParams
		);
		text.anchor.x = 0.5;
		text.anchor.y = 0;
		if(this.type === 'directory') {
			textParams.font = '14px Orbitron';
			text.position.y = 30;
		}
		else if(this.type === 'file') {
			text.anchor.y = 0.5;
			text.position.y = 0;
		}

		container.addChild(text);

		return container;
	},
	root:{
		name: '/',
		created: true,
		type: 'directory',
		items: [],
		children: [
			{
				name: 'file',
				created: false,
				type: 'file',
				items: [],
				children: [], // nodes go here
				itemsVisible: true,
				messages: []
			},
			{
				name: 'usr',
				created: true,
				type: 'directory',
				items: [],
				children: [
					{
						name: 'a',
						created: false,
						type: 'directory',
						items: [],
						children: [
							
						], // nodes go here
						itemsVisible: true,
						messages: []
					},
					{
						name: 'b',
						created: true,
						type: 'directory',
						items: [],
						children: [
							{
								name: 'c',
								created: false,
								type: 'directory',
								items: [],
								children: [
									
								], // nodes go here
								itemsVisible: true,
								messages: []
							}
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
				created: true,
				type: 'directory',

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