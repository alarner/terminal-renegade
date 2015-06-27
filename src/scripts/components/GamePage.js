var React = require('react');
var PIXI = require('pixi.js');
var globals = require('../globals');

var levels = [
	require('../maps/001_tutorial'),
	require('../maps/002_pilot_deck'),
	require('../maps/003_sewage_pipes'),
	require('../maps/004_biodome'),
	require('../maps/005_experimental_facility'),
	require('../maps/006_outer_space')
];

module.exports = React.createClass({
	getInitialState: function() {
		var level = {
			renderer: new PIXI.WebGLRenderer(800, 600),
			viewport: new PIXI.Container(),
			stage: new PIXI.Container()
		};
		var home = {
			renderer: new PIXI.WebGLRenderer(800, 600),
			stage: new PIXI.Container()
		};

		level.viewport.addChild(level.stage);

		return {
			page: 'home',
			level: level,
			home: home,
			character: character
		}
	},
	componentDidMount: function() {
		this.refs.pixiHome.getDOMNode().appendChild(
			this.state.home.renderer.view
		);
		this.refs.pixiLevel.getDOMNode().appendChild(
			this.state.level.renderer.view
		);
		this.animate();
	},
	render: function() {
		var homeStyle = {
			display: this.state.page === 'home' ? 'block' :'none'
		};
		var levelStyle = {
			display: this.state.page === 'level' ? 'block' :'none'
		};
		return (
			<section>
				<div style={homeStyle}>
					<div ref="pixiHome"></div>
					<button onClick={this.gotoLevel(0)}>Level 1</button>
					<button onClick={this.gotoLevel(1)}>Level 2</button>
					<button onClick={this.gotoLevel(2)}>Level 3</button>
					<button onClick={this.gotoLevel(3)}>Level 4</button>
					<button onClick={this.gotoLevel(4)}>Level 5</button>
				</div>
				<div style={levelStyle}>
					<div ref="pixiLevel"></div>
				</div>
			</section>
		);
	},
	gotoLevel: function(level) {
		var self = this;
		var character = {
			texture: PIXI.Texture.fromImage("../images/bunny.gif"),
			sprite: new PIXI.Sprite(this.texture)
		};
		return function(e) {
			console.log(levels[level]);
			self.drawNode(levels[level].root, levels[level].display);
			self.state.gameState.set({character:character.sprite});
			self.setState({page: 'level'});
		};
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
	drawNode: function(node, defaultDisplay, x, y) {
		var width = this.getNodeWidth(node, true);
		var height = this.getNodeHeight(node, true);

		x = x || 0;
		y = y || 0;

		var draw = node.display ? node.display() : defaultDisplay();
		draw.position.x = x + (width - draw.width)/2;
		draw.position.y = y;

		this.state.level.stage.addChild(draw);

		var newY = y+globals.node.size.height+globals.node.spacing.y;
		var previousNode = null;
		for(var i=0; i<node.children.length; i++) {
			var newX = x;
			if(previousNode) {
				newX += this.getNodeWidth(previousNode, true) + globals.node.spacing.x;
			}
			this.drawNode(node.children[i], defaultDisplay, newX, newY);
			previousNode = node.children[i];
		}
	},
	animate: function() {
		// start the timer for the next animation loop
		requestAnimationFrame(this.animate);

		// this is the main render call that makes pixi draw your container and its children.
		if(this.state.page === 'home') {
			this.state.home.renderer.render(this.state.home.stage);
		}
		else if(this.state.page === 'level') {
			this.state.level.renderer.render(this.state.level.viewport);
		}
	}
});