var React = require('react');
var PIXI = require('pixi.js');
var globals = require('../globals');
var CommandBox = require('./CommandBox');
var GameState = require('../models/GameState');

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
			stage: new PIXI.Container(),
			number: null
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
			gameState: new GameState()
		}
	},
	componentDidMount: function() {
		this.refs.pixiHome.getDOMNode().appendChild(
			this.state.home.renderer.view
		);
		this.refs.pixiLevel.getDOMNode().appendChild(
			this.state.level.renderer.view
		);
		var texture = PIXI.Texture.fromImage("../images/homepage_bg.png");
		var activeNodeTexture = PIXI.Texture.fromImage("../images/active_node.png");
		var activeConnectorTexture = PIXI.Texture.fromImage("../images/active_connector.png");
		var activeNode = new PIXI.Sprite(activeNodeTexture);
		var activeConnector = new PIXI.Sprite(activeConnectorTexture);
		activeConnector.position.y = 140;
		activeConnector.position.x = 130;
		activeConnector.rotation = 5.5;

		var position = 0;
		for(var i = 0; i < 17; i++){
			var background = new PIXI.Sprite(texture);
			background.position.y = position;
			position += 47;
			console.log(background)
			this.state.home.stage.addChild(background);
		}
		
		this.state.home.stage.addChild(activeNode);
		this.state.home.stage.addChild(activeConnector);

		this.animate();
	},
	render: function() {
		console.log("im getting called");
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
					<CommandBox gameState={this.state.gameState} />
					<button onClick={this.gotoLevel(0)}>Level 1</button>
					<button onClick={this.gotoLevel(1)}>Level 2</button>
					<button onClick={this.gotoLevel(2)}>Level 3</button>
					<button onClick={this.gotoLevel(3)}>Level 4</button>
					<button onClick={this.gotoLevel(4)}>Level 5</button>
				</div>
				<div style={levelStyle}>
					<div ref="pixiLevel"></div>
					<CommandBox gameState={this.state.gameState} />
				</div>
			</section>
		);
	},
	getLevel: function(level) {
		if(typeof level === 'undefined' || level === null) {
			level = this.state.level.number;
		}
		if(level === null) return false;
		return levels[level];
	},
	gotoLevel: function(level) {
		var self = this;
		var texture = PIXI.Texture.fromImage("../images/active_character.png");
		var character = new PIXI.Sprite(texture);
		character.scale.x = 0.25;
		character.scale.y = 0.25;
		character.anchor.x = 0.5;
		character.anchor.y = 0.5;
		
		return function(e) {
			self.state.gameState.clear({silent: true});
			self.setState(function(previousState) {

				console.log(self.getLevel(level));
				previousState.page = 'level';
				previousState.gameState.set({
					currentNode: self.getLevel(level).root,
					character: character
				});
				console.log(previousState.gameState);
				previousState.level.number = level;
				return previousState;
				// page: 'level',
			}, function() {
				self.redrawGame();
			});
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
	redrawGame: function() {
		var level = this.getLevel();
		// Draw map
		this.drawNode(level.root);

		// Place character
		var character = this.state.gameState.get('character');
		this.state.level.stage.addChild(character);
		var currentNode = this.state.gameState.get('currentNode');
		character.position = currentNode._display.position;


	},
	generateNode: function(node, defaultDisplay) {
		if(node._display) return node._display;

		var level = this.getLevel();

		var d = node.display ? node.display() : level.display.call(node);
		node._display = d;
		return node._display;
	},
	drawNode: function(node, x, y) {
		var width = this.getNodeWidth(node, true);
		var height = this.getNodeHeight(node, true);

		x = x || 0;
		y = y || 0;

		var parent = this.generateNode(node);
		parent.position.x = x + width/2;
		parent.position.y = y + globals.node.size.height/2;

		this.state.level.stage.addChild(parent);

		var newY = y+globals.node.size.height+globals.node.spacing.y;
		var previousNode = null;

		for(var i=0; i<node.children.length; i++) {
			var newX = x;
			if(previousNode) {
				newX += this.getNodeWidth(previousNode, true) + globals.node.spacing.x;
			}
			var child = this.drawNode(node.children[i], newX, newY);
			previousNode = node.children[i];
			this.state.level.stage.swapChildren(this.drawLine(parent, child), parent);
		}
		
		return parent;
	},
	drawLine: function(parent, child){
		var graphics = new PIXI.Graphics();
		graphics.lineStyle(3, 0xFF0000);
		graphics.moveTo(parent.position.x, parent.position.y);
		graphics.lineTo(child.position.x, child.position.y);
		this.state.level.stage.addChild(graphics);
		// this.state.level.stage.addChild(parent);
		// this.state.level.stage.addChild(child);	
		return graphics
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