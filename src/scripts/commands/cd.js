var clTools = require('../libs/command-tools');
var _ = require('lodash');
module.exports = {
	getPath: function(args, gameState) {
		var path = (args._.length > 1) ? args._[1] : '';
		path = clTools.normalizePath(path);
		return path;
	},
	run: function(args, gameState) {
		var path = this.getPath(args, gameState);

		var currentNode = gameState.get('currentNode');
		if(!currentNode) throw 'No current node!';

		if(path.charAt(0) === '/') {
			path = path.substring(1);
			currentNode = gameState.get('level').root;
		}
		
		var pieces = _.filter(path.split('/'), function(piece) {
			return piece.length;
		});

		for(var i=0; i<pieces.length; i++) {
			if(pieces[i] === '..') {
				if(currentNode._parent) {
					currentNode = currentNode._parent;
				}
			}
			else {
				var node = _.find(currentNode.children, function(child) {
					return (child.name === pieces[i])
				});
				if(node && node.type === 'directory' && node.created) {
					currentNode = node;
				}
				else if(node && node.type !== 'directory') {
					throw 'cd: not a directory: '+args[0];
				}
				else {
					throw 'cd: no such file or directory: '+args[0];
				}
			}
		}

		gameState.set({
			currentNode: currentNode
		});
		return false;
	}
};