var React = require('react');
var _ = require('lodash');
var minimist = require('minimist');
var clTools = require('../libs/command-tools');
var commands = {
	cd: require('../commands/cd'),
	exit: require('../commands/exit'),
	mkdir: require('../commands/mkdir'),
	open: require('../commands/open')
};

var KEY = {
	ENTER: 13,
	UP: 38,
	DOWN: 40,
	TAB: 9
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
			<input type="text" onKeyUp={this.keyUp} onKeyDown={this.keyDown} ref="input" style={style} />
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
	},
	keyDown: function(e) {
		if(e.which == KEY.TAB) {
			e.preventDefault();
			var pieces = this.refs.input.getDOMNode().value.split('/');
			var search = pieces.pop();
			var parentPath = pieces.join('/');
			try {
				var currentNode = clTools.getNodeFromPath(parentPath, this.props.gameState);
				var options = _.filter(currentNode.children, function(child) {
					console.log(child.name, search, _.startsWith(child.name, search));
					return _.startsWith(child.name, search);
				});
				console.log(search);
				console.log(currentNode);
				console.log(options);
			}
			catch(e) {
				console.log(e);
			}
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
			this.historyPosition--;
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

		var argv = minimist(args);

		if(!argv._.length) return;
		this.history.unshift(command);

		var c = argv._[0].toLowerCase();
		if(!this.props.gameState.availableCommands.get(c)) {
			return 'You don\'t have a command called `'+c+'`';
		}
		if(!commands.hasOwnProperty(c)) {
			return 'Command not found: `'+c+'`';
		}

		try {
			return commands[c].run(argv, this.props.gameState);
		}
		catch(e) {
			return e;
		}
	}
});