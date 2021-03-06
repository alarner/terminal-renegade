var React = require('react');
var _ = require('lodash');
var minimist = require('minimist');
var clTools = require('../libs/command-tools');
var powerups = require('../powerups');
// var commands = {
// 	cd: require('../commands/cd'),
// 	exit: require('../commands/exit'),
// 	mkdir: require('../commands/mkdir'),
// 	open: require('../commands/open')
// };

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
			var path = null;
			var command = this.refs.input.getDOMNode().value;
			if(!command) return;
			var args = _.filter(command.split(/\s+/), function(piece) {
				return piece;
			});

			var argv = minimist(args);
			if(!argv._.length) return;

			var c = argv._[0].toLowerCase();

			if(!this.props.availableCommands.get(c) || !powerups.hasOwnProperty(c)) {
				return;
			}

			try {
				path = powerups[c].actions.getPath(argv, this.props.gameState);
				if(!path) return;
			}
			catch(e) {
				return;
			}

			var pieces = path.split('/');
			var search = pieces.pop();
			var parentPath = pieces.length === 1 && !pieces[0] ? '/' : pieces.join('/');

			try {
				var currentNode = clTools.getNodeFromPath(parentPath, this.props.gameState);
				var options = _.filter(currentNode.children, function(child) {
					return _.startsWith(child.name, search) && child.created;
				});
				if(options.length === 1) {
					var pieces = command.split(' ');
					var prefix = pieces.pop();
					var pathPieces = prefix.split('/');
					pathPieces.pop();
					pathPieces.push(options[0].name);

					var newInput = pieces.join(' ') + ' ' + pathPieces.join('/');
					if(options[0].type === 'directory') {
						newInput += '/';
					}
					this.refs.input.getDOMNode().value = newInput;
				}
				else if(options.length > 1){
					var fill = '';
					var done = (options[0].name.length <= pos);
					var pos = search.length;
					var currentChar = null;
					while(!done) {
						currentChar = options[0].name.charAt(pos);
						for(var i=0; i<options.length; i++) {
							if(options[i].name.length <= pos || options[i].name.charAt(pos) !== currentChar) {
								done = true;
								break;
							}
						}
						if(!done) {
							fill += currentChar;
							pos++;
						}
					}
					this.refs.input.getDOMNode().value += fill;
					this.props.gameState.get('character').say('Your options are: '+_.map(options, function(child) {
						return child.name;
					}).join(', '));
				}
				else {
					return;
				}
			}
			catch(e) {
				// console.log(e);
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
		if(!this.props.availableCommands.get(c)) {
			return 'You don\'t have a command called `'+c+'`';
		}
		if(!powerups.hasOwnProperty(c)) {
			return 'Command not found: `'+c+'`';
		}

		try {
			return powerups[c].actions.run(argv, this.props.gameState);
		}
		catch(e) {
			return e;
		}
	}
});