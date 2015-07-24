var PIXI = require('pixi.js');
var globals = require('../globals');
module.exports = {
	number: 1,
	name: 'Pilot Deck',
	backgroundImage: '/images/level1_bg.png',
	music: '/music/level1.mp3',
	display: require('./node-styles/default'),
	root: {
		name: '/',
		created: true,
		type: 'directory',
		items: ['exit', 'cd', 'mkdir'],
		itemsVisible: true,
		messages: [
			{
				title: 'The Pilot Deck',
				body: globals.characterName+' needs to collect three digital documents to prove her suspicious about the nefarios nature of Sudo !!. Use the `cd` command to navigate the pilot deck in search of these documents.'
			},
			// {
			// 	title: 'You found the `exit` powerup!',
			// 	body: '`exit` allows you to leave this area of the ship and return home.'
			// }
		],
		say: [
		],
		children: [
			{
				name: 'terminal1',
				created: true,
				type: 'directory',
				items: [
					'goal'
				],
				itemsVisible: true,
				messages: [],
				say: [
					{
						message: 'Aha! There\'s one of the documents I\'m looking for. This will help me in my investigation.',
						danger: false
					}
				],
				children: [
				]
			},
			{
				name: 'terminal2',
				created: true,
				type: 'directory',
				items: [],
				itemsVisible: true,
				messages: [],
				say: [],
				children: [
					{
						name: 'nav_display',
						created: true,
						type: 'directory',
						items: [],
						itemsVisible: true,
						messages: [],
						say: [],
						children: [
							{
								name: 'terminal3',
								created: true,
								type: 'directory',
								items: [],
								itemsVisible: true,
								messages: [],
								say: [],
								children: [
									{
										name: 'paz',
										created: true,
										type: 'directory',
										items: [],
										itemsVisible: true,
										messages: [],
										say: [],
										children: [
										]
									}
								]
							}
						]
					},
					{
						name: 'comm_chair',
						created: true,
						type: 'directory',
						items: [],
						itemsVisible: true,
						messages: [],
						say: [],
						children: [
							{
								name: 'radio',
								created: true,
								type: 'directory',
								items: [],
								itemsVisible: true,
								messages: [],
								say: [],
								children: [
								]
							}
						]
					},
					{
						name: 'weapons_stn',
						created: true,
						type: 'directory',
						items: [
							'goal'
						],
						itemsVisible: true,
						messages: [],
						say: [
							{
								message: 'Aha! There\'s one of the documents I\'m looking for. This will help me in my investigation.',
								danger: false
							}
						],
						children: [
							{
								name: 'terminal4',
								created: true,
								type: 'directory',
								items: [],
								itemsVisible: true,
								messages: [],
								say: [],
								children: [
									{
										name: 'bar',
										created: true,
										type: 'directory',
										items: [],
										itemsVisible: true,
										messages: [],
										say: [],
										children: [
										]
									},
									{
										name: 'baz',
										created: true,
										type: 'directory',
										items: [
											'goal'
										],
										itemsVisible: true,
										messages: [],
										say: [
											{
												message: 'Aha! There\'s one of the documents I\'m looking for. This will help me in my investigation.',
												danger: false
											}
										],
										children: [
										]
									},
									{
										name: 'zap',
										created: true,
										type: 'directory',
										items: [],
										itemsVisible: true,
										messages: [],
										say: [],
										children: [
										]
									},
								]
							}
						]
					}
				]
			},

		]
	}
}

