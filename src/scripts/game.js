var globals = require('./globals');
module.exports = function(viewport, stage) {

	this.startLevel = function(level) {
		drawNode(level.root, level.display);
	};

	function getNodeWidth(node, pixels) {
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
					width += getNodeWidth(node.children[i]);
				}
			}
			node._width = width;
		}
		if(pixels) {
			return width*globals.node.size.width + (width-1)*globals.node.spacing.x;
		}
		return width;
	}

	function getNodeHeight(node, pixels) {
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
					var tmp = getNodeHeight(node.children[i]);
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
	}

	function drawNode(node, defaultDisplay, x, y) {
		var width = getNodeWidth(node, true);
		var height = getNodeHeight(node, true);

		x = x || 0;
		y = y || 0;

		var draw = node.display ? node.display() : defaultDisplay();
		draw.position.x = x + (width - draw.width)/2;
		draw.position.y = y;

		stage.addChild(draw);

		var newY = y+globals.node.size.height+globals.node.spacing.y;
		var previousNode = null;
		for(var i=0; i<node.children.length; i++) {
			var newX = x;
			if(previousNode) {
				newX += getNodeWidth(previousNode, true) + globals.node.spacing.x;
			}
			drawNode(node.children[i], defaultDisplay, newX, newY);
			previousNode = node.children[i];
		}
	}

};