var _ = require('lodash');
var globals = require('../globals');
module.exports = {
	normalizePath: function(path) {
		var home = '/home/'+globals.characterName;
		var p = home;
		if(path) {
			p = path;
		}

		if(p.length === 1 && p.charAt(0) === '~') {
			p = home;
		}
		else if(p.substring(0, 2) == '~/') {
			p = home + p.substring(1);
		}
		else if(p.length === 1 && p.charAt(0) === '.') {
			p = null;
		}
		else if(p.substring(0, 2) == './') {
			p = p.substring(2);
		}
		console.log('normalizePath', p);
		return p;
	},
	getNodeFromPath: function(path, gameState) {
		var currentNode = gameState.get('currentNode');

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
					throw 'not a directory: '+path;
				}
				else {
					throw 'no such file or directory: '+path;
				}
			}
		}
		return currentNode;
	},

	getPathFromCommand: function(command) {

	},

	createNode: function(name, isDir, parent) {
		var node = {
			name: name,
			created: true,
			type: isDir ? 'directory' : 'file',
			messages: [],
			children: [],
			say: [],
			items: [],
			itemsVisible: true,
			_parent: parent
		};
		return node;
	}
};