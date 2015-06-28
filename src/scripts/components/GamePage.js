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
var powerups = require('../powerups');

var homeLevel = renderTools.loadFreshLevel(require('../levels/_home'));

var levels = {
	'pilot_deck': require('../levels/002_pilot_deck'),
	'sewage_pipes': require('../levels/003_sewage_pipes'),
	'biodome': require('../levels/004_biodome'),
	'laboratory': require('../levels/005_experimental_facility'),
	'outer_space': require('../levels/006_outer_space')
};

module.exports = React.createClass({
	getInitialState: function() {
		return {
			exitModalOpen: false
		};
	},
	componentWillMount: function() {
		var self = this;
		this.gameState = new GameState();
		this.gameState.availableCommands = {
			home: new CommandCollection([
				{id: 'cd'},
				{id: 'open'}
			]),
			play: new CommandCollection([
				{id: 'cd'},
				{id: 'exit'}
			])
		};
		this.renderer = new PIXI.WebGLRenderer(
			globals.viewport.width,
			globals.viewport.height
		);
		this.renderer.backgroundColor = 0x141414;
		this.stages = {
			home: new PIXI.Container(),
			play: new PIXI.Container()
		};

		this.backgrounds = {
			home: null,
			play: null 
		};

		Modal.setAppElement(document.body);

		this.gameState.on('exit', this.onExitGame);
		this.gameState.on('start', this.onStartLevel);
		this.gameState.on('change', this.onGameStateChanged);
		this.gameState.on('change:currentNode', this.onNodeChanged);
	},
	onCommand: function(output, command) {
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
		renderTools.draw(
			this.stages[this.gameState.get('stage')],
			this.gameState
		);
	},
	onNodeChanged: function() {
		var node = this.gameState.get('currentNode');

		if(!node) return;

		if(node.say.length) {
			var say = node.say.shift();
			var self = this;
			// hacky
			setTimeout(function() {
				self.gameState.get('character').say(say.message, say.danger);
			}, 100);
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
	onStartLevel: function(e) {
		if(this.gameState.get('stage') !== 'home') return;
		var self = this;
		if(!e.node.levelName) {
			setTimeout(function() {
				self.gameState.get('character').say('There doesn\'t seem to be anything there.');
			}, 20);
		}
		else if(!levels.hasOwnProperty(e.node.levelName)) {
			setTimeout(function() {
				self.gameState.get('character').say('Something bad happened.');
			}, 20);
		}
		else {
			console.log(3);
			var newLevel = renderTools.loadFreshLevel(levels[e.node.levelName]);
			if(this.backgrounds.play) {
				this.stages.play.removeChild(this.backgrounds.play);
				this.backgrounds.play = null;
			}
			if(newLevel.backgroundImage) {
				var texture = PIXI.Texture.fromImage(newLevel.backgroundImage);
				this.backgrounds.play = new PIXI.extras.TilingSprite(
					texture,
					renderTools.getNodeWidth(newLevel.root, true) + globals.viewport.width,
					renderTools.getNodeHeight(newLevel.root, true) + globals.viewport.height
				);
				this.backgrounds.play.position.x = globals.viewport.width/-2;
				this.backgrounds.play.position.y = globals.viewport.height/-2;
				this.stages.play.addChild(this.backgrounds.play);
			}
			this.gameState.set({
				stage: 'play',
				level: newLevel,
				itemsCollected: 0,
				currentNode: newLevel.root
			});
			this.forceUpdate();
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
		if(this.backgrounds.home) {
			this.stages.home.removeChild(this.backgrounds.home);
		}
		var texture = PIXI.Texture.fromImage("../images/homepage_bg.png");
		this.backgrounds.home = new PIXI.extras.TilingSprite(
			texture,
			renderTools.getNodeWidth(homeLevel.root, true) + globals.viewport.width,
			renderTools.getNodeHeight(homeLevel.root, true) + globals.viewport.height
		);
		this.backgrounds.home.position.x = globals.viewport.width/-2;
		this.backgrounds.home.position.y = globals.viewport.height/-2;
		this.stages.home.addChild(this.backgrounds.home);

		this.gameState.set({
			stage: 'home',
			level: homeLevel,
			itemsCollected: 0,
			currentNode: homeLevel.root
		});
		this.forceUpdate();
	},
	render: function() {
		var level = null;
		if(this.gameState.get('stage') === 'play') {
			level = (
				<div className="level">
					<h4>Level {this.gameState.get('level').number}</h4>
					<h4 className="level-name">{this.gameState.get('level').name}</h4>
				</div>
			);
		}

		var powerupElements = this.gameState.availableCommands[this.gameState.get('stage')].map(function(pu) {
			console.log(pu);
			if(!powerups.hasOwnProperty(pu.id)) {
				return <div>bad powerup {pu.id}</div>
			}
			var powerup = powerups[pu.id];
			return (
				<div key={pu.id} className="pu">
					<div className="icon">
						<img src={powerup.icon || ''} />
					</div>
					<div className="command">
						{powerup.command}
					</div>
					<button type="button" className="info-btn"></button>
				</div>
			);
		});
		return (
			<section ref="game" className="play">
				<nav>
					<div className="headshot-level">
						<img src="/images/active_character.png" className="headshot" />
						{level}
					</div>
					<div className="powerups">
						<h4>Available Powerups</h4>
						{powerupElements}
					</div>
				</nav>
				<div className="right">
					<div ref="stage">
					</div>
					<CommandBox
						callback={this.onCommand}
						gameState={this.gameState}
						availableCommands={this.gameState.availableCommands[this.gameState.get('stage')]}
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
		console.log('componentDidMount');
		this.refs.stage.getDOMNode().appendChild(
			this.renderer.view
		);

		// Create Character
		var character = new Character();
		this.gameState.set({
			character: character
		});
		this.goHome();
		this.animate();
	},
	componentDidUpdate: function() {
		console.log('componentDidUpdate');
		this.refs.commandBox.getDOMNode().focus();
	},
	animate: function() {
		// start the timer for the next animation loop
		requestAnimationFrame(this.animate);

		this.renderer.render(
			this.stages[this.gameState.get('stage')]
		);
	}
});
