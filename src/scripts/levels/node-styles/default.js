var PIXI = require('pixi.js');
module.exports = function() {
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
}