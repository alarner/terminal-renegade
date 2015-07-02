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
		items: ['exit', 'cd'],
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
				items: [],
				itemsVisible: true,
				messages: [],
				say: [],
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
				]
			},

		]
	}
}

