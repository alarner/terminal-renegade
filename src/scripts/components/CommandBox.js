var React = require('react');
var _ = require('lodash');
var commands = {
	cd: require('../commands/cd')
};

var KEY = {
	ENTER: 13,
	UP: 38,
	DOWN: 40
};

module.exports = React.createClass({
	getInitialState: function() {
		return { historyPosition: 0 };
	},
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
		if(e.which === KEY.ENTER) {
			var error = this.executeCommand(this.refs.input.getDOMNode().value);
			this.refs.input.getDOMNode().value = '';
			this.setState({ historyPosition: 0 });
			return;
		}
		else if(e.which === KEY.UP) {
			e.preventDefault();
			var historyPosition = this.state.historyPosition + 1;
			var history = this.props.gameState.get('history');
			if(history.length < historyPosition) return;
			this.setState({ historyPosition: historyPosition });
			this.refs.input.getDOMNode().value = history[historyPosition-1];
		}
		else if(e.which === KEY.DOWN) {
			e.preventDefault();
			var historyPosition = this.state.historyPosition - 1;
			if(historyPosition < 1) {
				this.refs.input.getDOMNode().value = '';
				return;
			}
			var history = this.props.gameState.get('history');
			this.setState({ historyPosition: historyPosition });
			this.refs.input.getDOMNode().value = history[historyPosition-1];
		}
	},
	executeCommand: function(command) {
		if(!command) return;
		var args = _.filter(command.split(/\s+/), function(piece) {
			return piece;
		});

		if(!args.length) return;

		var history = this.props.gameState.get('history');
		history.unshift(command);
		this.props.gameState.set({ history: history });
		console.log(this.props.gameState.get('history'));

		var command = args.shift().toLowerCase();

		if(this.props.gameState.get('commandsAvailable').indexOf(command) < 0) {
			this.say('You don\'t have a command called `'+command+'`');
			return;
		}

		if(!commands.hasOwnProperty(command)) {
			this.say('Command not found: `'+command+'`');
			return;
		}

		var commandOutput = commands[command](args, this.props.gameState, this.props.level);
		if(commandOutput) {
			this.say(commandOutput);
		}
	},

	say: function(message) {
		console.log(message);
		this.props.gameState.set({chatText: message});
	}
});