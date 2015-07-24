module.exports = {
	cd: {
		command: 'cd',
		actions: require('./commands/cd'),
		icon: '/images/powerups/cd.png',
		description: '<p>Allows you to move from one place to another. You must\
		specify a path from where you would like to start to where you would\
		like to end up. Here are some examples of different types of paths that\
		you can use:</p>\
		<ul>\
			<li>\
				<code>cd nuclear_reactor</code> - This will move you into the\
				nuclear_reactor room, starting from where you are currently\
				standing.\
			</li>\
			<li>\
				<code>cd nuclear_reactor/sewage_system</code> - This will move\
				you through the nuclear_reactor into the sewage_system without\
				stopping. You sill start from where you are currently standing.\
			</li>\
			<li>\
				<code>cd /</code> - This will move you to the top most location,\
				often called the root.\
			</li>\
			<li>\
				<code>cd ~</code> or just <code>cd</code> - This will move you \
				to your home location from wherever you currently are.\
			</li>\
			<li>\
				<code>cd /engine_room</code> - This will move you to the\
				engine_room, starting at the top most location (root).\
			</li>\
		</ul>',
		man: ''
	},
	mkdir: {
		command: 'mkdir',
		actions: require('./commands/mkdir'),
		icon: '/images/powerups/mkdir.png',
		description: '',
		man: ''
	},
	open: {
		command: 'open',
		actions: require('./commands/open'),
		icon: '/images/powerups/open.png',
		description: '',
		man: ''
	},
	exit: {
		command: 'exit',
		actions: require('./commands/exit'),
		icon: '/images/powerups/exit.png',
		description: '',
		man: ''
	}
};