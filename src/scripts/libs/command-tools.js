var _ = require('lodash');
module.exports = {
	getNodeFromPath: function(path, gameState, parents) {
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
					return 'cd: not a directory: '+args[0];
				}
				else {
					return 'cd: no such file or directory: '+args[0];
				}
			}
		}
		return currentNode;
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