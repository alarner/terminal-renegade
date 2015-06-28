var React = require('react');
var PIXI = require('pixi.js');
var globals = require('../globals');
var CommandBox = require('./CommandBox');
var Modal = require('./Modal');
var GameState = require('../models/GameState');
var CommandModel = require('../models/CommandModel');
var CommandCollection = require('../collections/CommandCollection');
var TweenMax = require('gsap');
var Modal = require('react-modal');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			exitModalOpen: false
		};
	},
	componentWillMount: function() {
		var self = this;
		this.gameState = new GameState();
		this.gameState.availableCommands = new CommandCollection();
		this.gameState.availableCommands.add([
			{id: 'cd'},
			{id: 'exit'}
		]);
		this.commandBox = (
			<CommandBox
				callback={this.onCommand}
				gameState={this.gameState} />
		);
		this.renderer = new PIXI.WebGLRenderer(
			globals.viewport.width,
			globals.viewport.height
		);
		this.stages = {
			home: new PIXI.Container(),
			play: new PIXI.Container()
		};

		Modal.setAppElement(document.body);

		this.gameState.on('exit', this.onExitGame);
	},
	onCommand: function(output, command) {
		console.log('onCommand')
		console.log(output, command);
	},
	onExitGame: function() {
		if(this.gameState.get('currentStage') !== 'home') {
			this.setState({exitModalOpen: true});
		}
	},
	onConfirmExit: function() {
		this.setState({exitModalOpen: false});
		this.gameState.set({
			currentStage: 'home'
		});
	},
	cancelModal: function(name) {
		var self = this;
		return function(e) {
			var newState = {};
			newState[name+'ModalOpen'] = false;
			self.setState(newState);
		}
	},
	render: function() {
		return (
			<section ref="game">
				<div className="top">
					<nav>
						nav
					</nav>
					<div ref="stage">
					</div>
				</div>
				<div className="bottom">
					{this.commandBox}
				</div>
				<Modal isOpen={this.state.exitModalOpen}>
					<h1>Are you sure you want to exit this level?</h1>
					<button type="button" onClick={this.cancelModal('exit')}>Cancel</button>
					<button type="button" onClick={this.onConfirmExit}>Yes, Exit</button>
				</Modal>
			</section>
		);
	},
	componentDidMount: function() {
		this.refs.stage.getDOMNode().appendChild(
			this.renderer.view
		);
		// this.modals = {
		// 	exit: $(self.refs.exitModal.getDOMNode()).modal()
		// }

		// this.state.gameState.on('change', this.redrawGame);

		this.animate();
	},
	animate: function() {
		// start the timer for the next animation loop
		requestAnimationFrame(this.animate);

		this.renderer.render(
			this.stages[this.gameState.get('currentStage')]
		);
	}
});

// function updateParents(node, parent) {
// 	if(parent) {
// 		node._parent = parent;
// 	}

// 	if(node.children) {
// 		for(var i=0; i<node.children.length; i++) {
// 			updateParents(node.children[i], node);
// 		}
// 	}
// }

// var levels = [
// 	require('../maps/001_tutorial'),
// 	require('../maps/002_pilot_deck'),
// 	require('../maps/003_sewage_pipes'),
// 	require('../maps/004_biodome'),
// 	require('../maps/005_experimental_facility'),
// 	require('../maps/006_outer_space')
// ];

// for(var i=0; i<levels.length; i++) {
// 	updateParents(levels[i].root);
// }

// module.exports = React.createClass({
// 	getInitialState: function() {
// 		var level = {
// 			renderer: new PIXI.WebGLRenderer(800, 600),
// 			stage: new PIXI.Container(),
// 			number: null
// 		};
// 		var home = {
// 			renderer: new PIXI.WebGLRenderer(800, 600),
// 			stage: new PIXI.Container()
// 		};

// 		return {
// 			page: 'home',
// 			level: level,
// 			home: home,
// 			gameState: new GameState()
// 		}
// 	},

// 	render: function() {
// 		var homeStyle = {
// 			display: this.state.page === 'home' ? 'block' :'none'
// 		};
// 		var levelStyle = {
// 			display: this.state.page === 'level' ? 'block' :'none'
// 		};
// 		return (
// 			<section>
// 				<div style={homeStyle}>
// 					<div ref="pixiHome"></div>
// 					<CommandBox gameState={this.state.gameState} />
// 					<button onClick={this.gotoLevel(0)}>Level 1</button>
// 					<button onClick={this.gotoLevel(1)}>Level 2</button>
// 					<button onClick={this.gotoLevel(2)}>Level 3</button>
// 					<button onClick={this.gotoLevel(3)}>Level 4</button>
// 					<button onClick={this.gotoLevel(4)}>Level 5</button>
// 				</div>
// 				<div style={levelStyle}>
// 					<div ref="pixiLevel"></div>
// 					<CommandBox gameState={this.state.gameState} />
// 				</div>
// 			</section>
// 		);
// 	},
// 	getLevel: function(level) {
// 		if(typeof level === 'undefined' || level === null) {
// 			level = this.state.level.number;
// 		}
// 		if(level === null) return false;
// 		return levels[level];
// 	},
// 	gotoLevel: function(level) {
// 		var self = this;
// 		var texture = PIXI.Texture.fromImage("../images/active_character.png");
// 		var character = new PIXI.Sprite(texture);
// 		character.scale.x = 0.25;
// 		character.scale.y = 0.25;
// 		character.anchor.x = 0.5;
// 		character.anchor.y = 0.5;
		
// 		return function(e) {
// 			self.state.gameState.clear({silent: true});
// 			self.setState(function(previousState) {

// 				previousState.page = 'level';
// 				previousState.gameState.set({
// 					currentNode: self.getLevel(level).root,
// 					character: character,
// 					commandsAvailable: ['cd'],
// 					level: self.getLevel(level),
// 					history: []
// 				});
// 				previousState.level.number = level;
// 				return previousState;
// 				// page: 'level',
// 			}, function() {
// 				self.redrawGame();
// 			});
// 		};
// 	},
// 	getNodeWidth: function(node, pixels) {
// 		var width = 0;
// 		if(node._width) {
// 			width = node._width;
// 		}
// 		else {
// 			if(!node.children.length) {
// 				width = 1;
// 			}
// 			else {
// 				for(var i=0; i<node.children.length; i++) {
// 					width += this.getNodeWidth(node.children[i]);
// 				}
// 			}
// 			node._width = width;
// 		}
// 		if(pixels) {
// 			return width*globals.node.size.width + (width-1)*globals.node.spacing.x;
// 		}
// 		return width;
// 	},
// 	getNodeHeight: function(node, pixels) {
// 		var height = 0;
// 		if(node._height) {
// 			height =  node._height;
// 		}
// 		else {
// 			if(!node.children.length) {
// 				height = 1;
// 			}
// 			else {
// 				var maxHeight = 0;
// 				for(var i=0; i<node.children.length; i++) {
// 					var tmp = this.getNodeHeight(node.children[i]);
// 					if(tmp > maxHeight) maxHeight = tmp;
// 				}
// 				height = 1+maxHeight;
// 			}
// 			node._height = height;
// 		}
// 		if(pixels) {
// 			return height*globals.node.size.height + (height-1)*globals.node.spacing.y;
// 		}
// 		return height;
// 	},
// 	redrawGame: function(gameState) {
// 		gameState = gameState || this.state.gameState;
// 		var level = this.getLevel();
// 		// Draw map
// 		if(level && level.root) {
// 			this.drawNode(level.root);
// 		}

// 		// Place character
// 		var character = gameState.get('character');
// 		this.state.level.stage.addChild(character);
// 		var currentNode = gameState.get('currentNode');
// 		if(currentNode && currentNode._display) {
// 			character.position.x = currentNode._display.position.x;
// 			character.position.y = currentNode._display.position.y - 20;
// 		}

// 		// Center stage
// 		if(currentNode._display) {
// 			TweenMax.to(
// 				this.state.level.stage.position,
// 				0.5,
// 				{
// 					x: this.state.level.renderer.width/2 - currentNode._display.x,
// 					y: this.state.level.renderer.height/2 - currentNode._display.y
// 				}
// 			);
// 		}
// 	},
// 	generateNode: function(node, defaultDisplay) {
// 		if(node._display) return node._display;

// 		var level = this.getLevel();

// 		var d = node.display ? node.display() : level.display.call(node);
// 		node._display = d;
// 		return node._display;
// 	},
// 	drawNode: function(node, x, y) {
// 		var width = this.getNodeWidth(node, true);
// 		var height = this.getNodeHeight(node, true);

// 		x = x || 0;
// 		y = y || 0;

// 		var parent = this.generateNode(node);
// 		parent.position.x = x + width/2;
// 		parent.position.y = y + globals.node.size.height/2;

// 		this.state.level.stage.addChild(parent);

// 		var newY = y+globals.node.size.height+globals.node.spacing.y;
// 		var previousNode = null;
// 		var newX = x;

// 		for(var i=0; i<node.children.length; i++) {
// 			if(previousNode) {
// 				newX += this.getNodeWidth(previousNode, true) + globals.node.spacing.x;
// 			}
// 			var child = this.drawNode(node.children[i], newX, newY);
// 			previousNode = node.children[i];
// 			this.state.level.stage.swapChildren(this.drawLine(parent, child), parent);
// 		}
		
// 		return parent;
// 	},
// 	drawLine: function(parent, child){
// 		var graphics = new PIXI.Graphics();
// 		graphics.lineStyle(3, 0xFF0000);
// 		graphics.moveTo(parent.position.x, parent.position.y);
// 		graphics.lineTo(child.position.x, child.position.y);
// 		this.state.level.stage.addChild(graphics);
// 		return graphics
// 	}
// });