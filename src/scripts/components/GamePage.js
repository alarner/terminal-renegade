var React = require('react');
var PIXI = require('pixi.js');
var globals = require('../globals');
var CommandBox = require('./CommandBox');
var Modal = require('./Modal');
var GameState = require('../models/GameState');
var CommandModel = require('../models/CommandModel');
var CommandCollection = require('../collections/CommandCollection');
var Modal = require('react-modal');
var renderTools = require('../libs/render-tools');
var Character = require('../libs/character');

var homeLevel = renderTools.loadFreshLevel(require('../levels/_home'));

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
		this.gameState.on('change', this.onGameStateChanged);
		this.gameState.on('change:currentNode', this.onNodeChanged);
	},
	onCommand: function(output, command) {
		console.log('onCommand')
		console.log(output, command);
		if(output) {
			this.gameState.get('character').say(output, true);
		}
		else {
			this.gameState.get('character').say(false);
		}
	},
	onExitGame: function() {
		if(this.gameState.get('stage') !== 'home') {
			this.setState({exitModalOpen: true});
		}
	},
	onConfirmExit: function() {
		this.setState({exitModalOpen: false});
		this.goHome();
	},
	onGameStateChanged: function() {
		console.log('onGameStateChanged');
		renderTools.draw(
			this.stages[this.gameState.get('stage')],
			this.gameState
		);
	},
	onNodeChanged: function() {
		console.log('onNodeChanged');
		var node = this.gameState.get('currentNode');

		if(!node) return;

		if(node.say.length) {
			var say = node.say.shift();
			var self = this;
			// hacky
			setTimeout(function() {
				self.gameState.get('character').say(say.message, say.danger);
			}, 1);
		}

		if(node === homeLevel.root.children[0]) {
			console.log('go to pilot deck');
		}
		else if(node === homeLevel.root.children[1]) {
			console.log('go to sewage pipes');
		}
		else if(node === homeLevel.root.children[2]) {
			console.log('go to biodome');
		}
		else if(node === homeLevel.root.children[3]) {
			console.log('go to laboratory');
		}
		else if(node === homeLevel.root.children[4]) {
			console.log('go to outer space');
		}
	},
	cancelModal: function(name) {
		var self = this;
		return function(e) {
			var newState = {};
			newState[name+'ModalOpen'] = false;
			self.setState(newState);
		}
	},
	goHome: function() {
		this.gameState.set({
			stage: 'home',
			level: homeLevel,
			itemsCollected: 0,
			level: homeLevel,
			currentNode: homeLevel.root
		});
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
					<CommandBox
						callback={this.onCommand}
						gameState={this.gameState}
						ref="commandBox" />
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

		// Create Character
		var character = new Character();
		this.gameState.set({
			character: character
		});
		this.goHome();

		var self = this;
		setTimeout(function() {
			self.refs.commandBox.getDOMNode().focus();
		}, 20)

		this.animate();
	},
	animate: function() {
		// start the timer for the next animation loop
		requestAnimationFrame(this.animate);

		this.renderer.render(
			this.stages[this.gameState.get('stage')]
		);
	}
});
