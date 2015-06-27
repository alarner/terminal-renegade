var globals = require('../globals');
var _ = require('lodash');
module.exports = function(args, gameState) {
	var home = '/home/'+globals.characterName;
	var path = home;
	if(args.length) {
		path = args[0];
	}

	var currentNode = null;
	if(path.charAt(0) === '/') {
		currentNode = gameState.get('level').root;
		path = path.substring(1);
	}
	else if(path.length === 1 && path.charAt(0) === '~') {
		path = home;
	}
	else if(path.substring(0, 2) == '~/') {
		path = home + path.substring(1);
	}
	else {
		currentNode = gameState.get('currentNode');
	}

	var pieces = _.filter(path.split('/'), function(piece) {
		return piece.length;
	});

	// console.log(currentNode, pieces);

	for(var i=0; i<pieces.length; i++) {
		var node = _.find(currentNode.children, function(child) {
			return (child.name === pieces[i])
		});
		if(node && node.type === 'directory' && node.created) {
			currentNode = node;
		}
		else {
			return 'cd: no such file or directory: '+args[0];
		}
	}

	gameState.set({
		currentNode: currentNode
	});
	return false;
}