var _ = require('lodash');
var clTools = require('../libs/command-tools');
module.exports = {
	getPath: function(args, gameState) {
		var path = null;
		if(args._.length < 2) {
			if(!args.p || !_.isString(args.p)) {
				throw 'mkdir: missing operand';
			}
			else {
				path = args.p;
			}
		}
		else {
			path = args._[1];
		}
		return path;
	},
	run: function(args, gameState) {
		var path = this.getPath(args, gameState);
		var parents = false;

		var originalPath = path;

		if(args.p) parents = true;

		var currentNode = gameState.get('currentNode');
		if(!currentNode) throw 'No current node!';

		if(path.charAt(0) === '/') {
			path = path.substring(1);
			currentNode = gameState.get('level').root;
		}
		
		var pieces = _.filter(path.split('/'), function(piece) {
			return piece.length;
		});
		var dirname = pieces.pop();

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
					throw 'mkdir: cannot create directory ‘'+originalPath+'’: Not a directory';
				}
				else if(parents) {
					var newNode = clTools.createNode(pieces[i], true, currentNode);
					currentNode.children.push(newNode);
					currentNode = newNode;
				}
				else {
					throw 'mkdir: cannot create directory ‘'+originalPath+'’: No such file or directory';
				}
			}
		}

		var node = _.find(currentNode.children, function(child) {
			return (child.name === dirname);
		});
		if(node && node.created) {
			throw 'mkdir: cannot create directory ‘'+originalPath+'’: File exists';
		}
		var newNode = clTools.createNode(dirname, true, currentNode);
		currentNode.children.push(newNode);
		gameState.trigger('change');
		return false;
	}
};