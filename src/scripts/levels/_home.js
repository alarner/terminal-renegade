var PIXI = require('pixi.js');
var globals = require('../globals');
module.exports = {
	backgroundImage: '/images/homepage_bg.png',
	music: '/music/story_and_home.mp3',
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
		items: ['mkdir'],
		itemsVisible: true,
		messages: [],
		say: [
			{
				message: 'Hrmm... how can I get off this ship... let\'s try typing `cd engine_room` and then pressing enter.',
				danger: false
			},
			{
				message: 'I can also quickly skip rooms in the ship. Try typing `cd nuclear_reactor/pilot_deck`.',
				danger: false
			}
		],
		children: [
			{
				name: 'engine_room',
				created: true,
				type: 'directory',
				items: [],
				itemsVisible: true,
				messages: [],
				children: [],
				say: [
					{
						message: 'Nice! To move back up type `cd ..`',
						danger: false
					}
				]
			},
			{
				name: 'nuclear_reactor',
				created: true,
				type: 'directory',
				items: [],
				itemsVisible: true,
				messages: [],
				children: [
					{
						name: 'pilot_deck',
						created: true,
						type: 'directory',
						items: [],
						itemsVisible: true,
						levelName: 'pilot_deck',
						messages: [
						],
						say: [
							{
								message: 'Now that was fast! I can also jump back to top spot by typing `cd /`',
								danger: false
							}
						],
						children: [
							{
								name: 'biodome',
								created: false,
								type: 'directory',
								items: [],
								itemsVisible: true,
								levelName: 'biodome',
								messages: [],
								children: []
							},
							{
								name: 'laboratory',
								created: false,
								type: 'directory',
								items: [],
								itemsVisible: true,
								levelName: 'laboratory',
								messages: [],
								children: []
							}
						]
					},
					{
						name: 'sewage_pipes',
						created: true,
						type: 'directory',
						items: [],
						itemsVisible: true,
						levelName: 'sewage_pipes',
						messages: [],
						children: [
							{
								name: 'outer_space',
								created: false,
								type: 'directory',
								items: [],
								itemsVisible: true,
								messages: [],
								children: []
							}
						]
					}
				],
				say: [
					{
						message: 'Yikes! I can feel myself getting cancer! quickly `cd ..` to get me back to safety and skip this room next time.',
						danger: true
					}
				]
			},
			
		]
	}
}