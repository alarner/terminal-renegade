var PIXI = require('pixi.js');
var globals = require('../globals');

module.exports = function() {
	// Container
	this.container = new PIXI.Container();

	// Character
	var texture = PIXI.Texture.fromImage("../images/active_character.png");
	this.character = new PIXI.Sprite(texture);
	this.character.scale.x = 0.25;
	this.character.scale.y = 0.25;
	this.character.anchor.x = 0.5;
	this.character.anchor.y = 0.5;

	// Chat bubble
	var chat = null;

	this.container.addChild(this.character);

	this.say = function(message, error) {
		if(chat) {
			this.container.removeChild(chat);
		}

		if(message === false) return;
		var textParams = {
			font : '14px Metrophobic',
			align : 'center',
			wordWrap: true,
			wordWrapWidth: 200,
			padding:
 5,
			fill: 0x141414
		};
		var text = new PIXI.Text(
			message,
			textParams
		);
		var textBounds = text.getBounds();

		chat = new PIXI.Graphics();
		chat.beginFill(0xFFFFFF);
		if(error) {
			chat.lineStyle(2, 0xEB158E);
		}
		else {
			chat.lineStyle(2, 0xBEDB16);
		}
		// chat.position.x = (this.container.width/2)
		// chat.position.y = 0;
		// chat.anchor.x = 0.5;
		// chat.anchor.y = 0;
		chat.drawRoundedRect(
			0,
			0,
			textBounds.width+2*globals.chat.padding,
			textBounds.height+2*globals.chat.padding
		);
		chat.addChild(text);
		text.position.x = globals.chat.padding;
		text.position.y = globals.chat.padding;

		var x = -chat.width/2;
		var y = -1*this.container.height - chat.height/2 - 30;

		this.container.addChild(chat);

		chat.position.x = x;
		chat.position.y = y;
	};
};