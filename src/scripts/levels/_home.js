var globals = require('../globals');
module.exports = {
	backgroundImage: '/images/homepage_bg.png',
	music: '/music/story_and_home.mp3',
	display: require('./node-styles/default'),
	root:{
		name: '/',
		created: true,
		type: 'directory',
		items: ['cd'],
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
			},
			{
				message: 'Woohoo! Let\'s try something a bit more difficult. That pilot deck looked interesting. I want to visit it. Type `open nuclear_reactor/pilot_deck` to check it out.',
				danger: false
			}
		],
		children: [
			{
				name: 'engine_room',
				created: true,
				type: 'directory',
				items: ['open'],
				itemsVisible: true,
				messages: [
					{
						title: 'You found the `open` powerup!',
						body: '`open` allows you to dig deeper into areas within the ship. Not all areas can be opened, but some can.'
					}
				],
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
						created: false,
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