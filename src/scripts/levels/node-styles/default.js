var PIXI = require('pixi.js');
var goals = require('../../goals');
var powerups = require('../../powerups');
module.exports = function(level) {
	return function() {
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

		var i;
		var item;
		var itemTexture;
		var itemSprite;
		var positions = [
			{
				x: -52,
				y: -40
			},
			{
				x: 7,
				y: -40
			}
		];
		if(this.items && this.items.length) {
			i = 0;
			while(i < this.items.length && i < positions.length) {
				item = this.items[i];
				if(item === 'goal') {
					itemTexture = PIXI.Texture.fromImage(goals[level].icon);
				}
				else if(powerups.hasOwnProperty(item)) {
					itemTexture = PIXI.Texture.fromImage(powerups[item].icon);
					// itemTexture = PIXI.Texture.fromImage("../images/level1_item.png");
				}

				itemSprite = new PIXI.Sprite(itemTexture);
				itemSprite.position.x = positions[i].x;
				itemSprite.position.y = positions[i].y;
				container.addChild(itemSprite);

				i++;
			}
		}

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
	};
}