var clTools = require('../libs/command-tools');
var _ = require('lodash');
module.exports = {
	getPath: function(args, gameState) {
		var path = (args._.length > 1) ? args._[1] : '';
		path = clTools.normalizePath(path);
		return path;
	},
	run: function(args, gameState) {
		var currentNode = this.getNewNode(args, gameState);

		if(currentNode.items && currentNode.items.length) {
			_.each(currentNode.items, function(item) {
				gameState.availableCommands[gameState.get('stage')].add({id: item});
			});
			currentNode.items = [];
		}

		gameState.set({
			currentNode: currentNode
		});
		return false;
	},
	getNewNode: function(args, gameState) {
		var path = this.getPath(args, gameState);
		console.log('getNewNode', path);
		var originalPath = path;
		if(path === null) return false;

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
			else if(pieces[i] === '.') {
				continue;
			}
			else {
				var node = _.find(currentNode.children, function(child) {
					return (child.name === pieces[i])
				});
				if(node && node.type === 'directory' && node.created) {
					currentNode = node;
				}
				else if(node && node.type !== 'directory') {
					throw 'not a directory: '+originalPath;
				}
				else {
					throw 'no such file or directory: '+originalPath;
				}
			}
		}
		return currentNode;
	}
};