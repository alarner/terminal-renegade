var React = require('react');
var _ = require('lodash');
var commands = {
	cd: require('../commands/cd'),
	exit: require('../commands/exit')
};

var KEY = {
	ENTER: 13,
	UP: 38,
	DOWN: 40
};

module.exports = React.createClass({
	historyPosition: 0,
	history: [],
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
	focus: function() {
		this.refs.input.getDOMNode().focus();
	},
	keyUp: function(e) {
		if(e.which === KEY.ENTER) {
			var command = this.refs.input.getDOMNode().value;
			var error = this.executeCommand(command);
			this.refs.input.getDOMNode().value = '';
			this.historyPosition = 0;
			return this.props.callback(error, command);
		}
		else if(e.which === KEY.UP) {
			e.preventDefault();
			this.historyPosition++;
			if(this.history.length < this.historyPosition) {
				this.historyPosition = this.history.length;
				return;
			}
			this.refs.input.getDOMNode().value = this.history[this.historyPosition-1];
		}
		else if(e.which === KEY.DOWN) {
			e.preventDefault();
			this.historyPosition++;
			if(this.historyPosition < 1) {
				this.refs.input.getDOMNode().value = '';
				this.historyPosition = 0;
				return;
			}
			this.refs.input.getDOMNode().value = this.history[this.historyPosition-1];
		}
	},
	executeCommand: function(command) {
		if(!command) return;
		var args = _.filter(command.split(/\s+/), function(piece) {
			return piece;
		});

		if(!args.length) return;
		this.history.unshift(command);

		var c = args.shift().toLowerCase();
		if(!this.props.gameState.availableCommands.get(c.toLowerCase())) {
			return 'You don\'t have a command called `'+c+'`';
		}
		if(!commands.hasOwnProperty(c)) {
			return 'Command not found: `'+c+'`';
		}
		return commands[c](args, this.props.gameState);
	}
});