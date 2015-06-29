var _ = require('lodash');
var globals = require('../globals');
var TweenMax = require('gsap');
module.exports = {
	loadFreshLevel: function(level) {
		var newLevel = _.cloneDeep(level);
		this.setDefaults(newLevel.root);
		this.updateParents(newLevel.root);
		return newLevel;
	},
	setDefaults: function(node) {
		if(!node.say) node.say = [];
		if(!node.messages) node.messages = [];
		if(!node.children) node.children = [];
		if(!node.type) node.type = 'directory';
		if(!node.items) node.items = [];
		if(typeof node.itemsVisible === 'undefined') node.itemsVisible = true;

		for(var i=0; i<node.children.length; i++) {
			this.setDefaults(node.children[i]);
		}

	},
	updateParents: function(node, parent) {
		if(parent) {
			node._parent = parent;
		}

		if(node.children) {
			for(var i=0; i<node.children.length; i++) {
				this.updateParents(node.children[i], node);
			}
		}
	},
	getNodeWidth: function(node, pixels) {
		var width = 0;
		if(node._width) {
			width = node._width;
		}
		else {
			if(!node.children.length) {
				width = 1;
			}
			else {
				for(var i=0; i<node.children.length; i++) {
					width += this.getNodeWidth(node.children[i]);
				}
			}
			node._width = width;
		}
		if(pixels) {
			return width*globals.node.size.width + (width-1)*globals.node.spacing.x;
		}
		return width;
	},
	getNodeHeight: function(node, pixels) {
		var height = 0;
		if(node._height) {
			height =  node._height;
		}
		else {
			if(!node.children.length) {
				height = 1;
			}
			else {
				var maxHeight = 0;
				for(var i=0; i<node.children.length; i++) {
					var tmp = this.getNodeHeight(node.children[i]);
					if(tmp > maxHeight) maxHeight = tmp;
				}
				height = 1+maxHeight;
			}
			node._height = height;
		}
		if(pixels) {
			return height*globals.node.size.height + (height-1)*globals.node.spacing.y;
		}
		return height;
	},
	draw: function(stage, gameState) {
		console.log('draw');
		stage.removeChildren();
		var level = gameState.get('level');
		var currentNode = gameState.get('currentNode');
		var character = gameState.get('character');


		if(level && level.backgroundImage) {
			var texture = PIXI.Texture.fromImage(level.backgroundImage);
			var bg = new PIXI.extras.TilingSprite(
				texture,
				this.getNodeWidth(level.root, true) + globals.viewport.width,
				this.getNodeHeight(level.root, true) + globals.viewport.height
			);
			bg.position.x = globals.viewport.width/-2;
			bg.position.y = globals.viewport.height/-2;
			stage.addChild(bg);
		}

		// Draw map
		if(level && level.root) {
			var nodeAssets = this.buildNode(level.root, 0, 0, gameState);
			_.each(nodeAssets.lines, function(line) {
				stage.addChild(line);
			});
			_.each(nodeAssets.nodes, function(node) {
				stage.addChild(node);
			});
		}

		// Place character
		if(character) {
			stage.addChild(character.container);

			if(currentNode && currentNode._display) {
				character.container.position.x = currentNode._display.position.x;
				character.container.position.y = currentNode._display.position.y - 20;
			}
		}

		// Center stage
		if(currentNode && currentNode._display) {
			TweenMax.to(
				stage.position,
				0.5,
				{
					x: globals.viewport.width/2 - currentNode._display.x,
					y: globals.viewport.height/2 - currentNode._display.y
				}
			);
		}
	},
	generateNode: function(node, gameState) {
		if(node._display) return node._display;

		var level = gameState.get('level');

		var d = node.display ? node.display() : level.display.call(node);
		node._display = d;
		return node._display;
	},
	buildNode: function(node, x, y, gameState) {
		var width = this.getNodeWidth(node, true);
		var height = this.getNodeHeight(node, true);

		x = x || 0;
		y = y || 0;

		var parent = this.generateNode(node, gameState);
		parent.position.x = node.x || (x + width/2);
		parent.position.y = node.y || (y + globals.node.size.height/2);

		var newY = y+globals.node.size.height+globals.node.spacing.y;
		var previousNode = null;
		var newX = x;
		var nodes = [parent];
		var lines = [];

		for(var i=0; i<node.children.length; i++) {
			if(previousNode) {
				newX += this.getNodeWidth(previousNode, true) + globals.node.spacing.x;
			}
			var nodeAssets = this.buildNode(node.children[i], newX, newY, gameState);
			nodeAssets.lines.push(this.drawLine(parent, nodeAssets.nodes[0]));

			nodes = nodes.concat(nodeAssets.nodes);
			lines = lines.concat(nodeAssets.lines);

			previousNode = node.children[i];
		}

		return {
			nodes: nodes,
			lines: lines
		};
	},
	drawLine: function(parent, child){
		var graphics = new PIXI.Graphics();
		graphics.lineStyle(10, 0x2C2A7C);
		graphics.moveTo(parent.position.x, parent.position.y);
		graphics.lineTo(child.position.x, child.position.y);
		return graphics;
	}
};