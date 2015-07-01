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
				title: 'You found the `exit` powerup!',
				body: '`exit` allows you to leave this area of the ship and return home.'
			}
		],
		say: []
	}
}

