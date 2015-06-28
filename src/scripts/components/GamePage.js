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

		this.addHomePage();

		this.state.gameState.on('change', this.redrawGame);

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

				previousState.page = 'level';
				previousState.gameState.set({
					currentNode: self.getLevel(level).root,
					character: character,
					commandsAvailable: ['cd'],
					level: self.getLevel(level)
				});
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
	redrawGame: function(gameState) {
		gameState = gameState || this.state.gameState;
		var level = this.getLevel();
		// Draw map
		if(level && level.root) {
			this.drawNode(level.root);
		}

		// Place character
		var character = gameState.get('character');
		this.state.level.stage.addChild(character);
		var currentNode = gameState.get('currentNode');
		if(currentNode && currentNode._display) {
			character.position = currentNode._display.position;
		}
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
	},
	addHomePage: function(){
		var texture = PIXI.Texture.fromImage("../images/homepage_bg.png");
		var activeNodeTexture = PIXI.Texture.fromImage("../images/active_node.png");
		var activeConnectorTexture = PIXI.Texture.fromImage("../images/active_connector.png");
		var characterTexture = PIXI.Texture.fromImage("../images/active_character.png");

		var activeNode = new PIXI.Sprite(activeNodeTexture);
		activeNode.position.x = 60;
		activeNode.position.y = 30;

		var activeNode2 = new PIXI.Sprite(activeNodeTexture);
		activeNode2.position.x = 260;
		activeNode2.position.y = 230;

		var character = new PIXI.Sprite(characterTexture);
		character.position.x = activeNode2.position.x + 53;
		character.position.y = activeNode2.position.y + 45;
		character.scale.x = 0.25;
		character.scale.y = 0.25;

		var activeNode3 = new PIXI.Sprite(activeNodeTexture);
		activeNode3.position.x = 60;
		activeNode3.position.y = 430;

		var activeConnector = new PIXI.Sprite(activeConnectorTexture);
		activeConnector.position.y = 175;
		activeConnector.position.x = 185;
		activeConnector.rotation = 5.5;

		var activeConnector2 = new PIXI.Sprite(activeConnectorTexture);
		activeConnector2.position.y = 355;
		activeConnector2.position.x = 270;
		activeConnector2.rotation = -5.5;

		var activeConnector3 = new PIXI.Sprite(activeConnectorTexture);
		activeConnector3.position.y = 155;
		activeConnector3.position.x = 470;
		activeConnector3.rotation = -5.5;

		var activeConnector4 = new PIXI.Sprite(activeConnectorTexture);
		activeConnector4.position.y = 300;
		activeConnector4.position.x = 540;
		activeConnector4.rotation = 1.57079633;

		var activeConnector5 = new PIXI.Sprite(activeConnectorTexture);
		activeConnector5.position.y = 370;
		activeConnector5.position.x = 390;
		activeConnector5.rotation = 5.5;

		var position = 0;
		for(var i = 0; i < 17; i++){
			var background = new PIXI.Sprite(texture);
			background.position.y = position;
			position += 47;
			this.state.home.stage.addChild(background);
		}
		
		this.state.home.stage.addChild(activeNode);
		this.state.home.stage.addChild(activeConnector);
		this.state.home.stage.addChild(activeConnector2);
		this.state.home.stage.addChild(activeConnector3);
		this.state.home.stage.addChild(activeConnector4);
		this.state.home.stage.addChild(activeConnector5);
		this.state.home.stage.addChild(activeNode2);
		this.state.home.stage.addChild(activeNode3);
		this.state.home.stage.addChild(character);

	}
});