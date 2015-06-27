var React = require('react');
var _ = require('lodash');
var commands = {
	cd: require('../commands/cd')
};

module.exports = React.createClass({
	render: function() {
		var style = {
			width: '800px',
			lineHeight: '30px',
			fontSize: '24px',
			backgroundColor: '#000',
			color: '#fff',
			border: 0,
			outline: 'none',
			boxSizing: 'border-box',
			padding: '4px'
		};
		return (
			<input type="text" onKeyUp={this.keyUp} ref="input" style={style} />
		);
	},
	keyUp: function(e) {
		if(e.which === 13) {
			var error = this.executeCommand(this.refs.input.getDOMNode().value);
			this.refs.input.getDOMNode().value = '';
			return;
		}
	},
	executeCommand: function(command) {
		if(!command) return;
		var args = _.filter(command.split(/\s+/), function(piece) {
			return piece;
		});

		if(!args.length) return;

		var command = args.shift().toLowerCase();

		if(this.props.gameState.get('commandsAvailable').indexOf(command) < 0) {
			this.say('You don\'t have a command called `'+command+'`');
			return;
		}

		if(!commands.hasOwnProperty(command)) {
			this.say('Command not found: `'+command+'`');
			return;
		}

		var commandOutput = commands[command](args, this.props.gameState);
		if(commandOutput) {
			this.say(commandOutput);
		}
	},

	say: function(message) {
		this.props.gameState.set({chatText: message});
	}
});