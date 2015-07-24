var React = require('react');
var PIXI = require('pixi.js');
var _ = require('lodash');
var globals = require('../globals');
var CommandBox = require('./CommandBox');
var Modal = require('./Modal');
var GameState = require('../models/GameState');
var CommandModel = require('../models/CommandModel');
// var CommandCollection = require('../collections/CommandCollection');
var renderTools = require('../libs/render-tools');
var Character = require('../libs/character');
var powerups = require('../powerups');

var homeLevel = renderTools.loadFreshLevel(require('../levels/_home'));

var levels = {
	'pilot_deck': require('../levels/001_pilot_deck'),
	'sewage_pipes': require('../levels/003_sewage_pipes'),
	'biodome': require('../levels/004_biodome'),
	'laboratory': require('../levels/005_experimental_facility'),
	'outer_space': require('../levels/006_outer_space')
};

module.exports = React.createClass({
	getInitialState: function() {
		return {
			modals: {
				exit: false,
				powerup: false,
				message: false
			}
		};
	},
	componentWillMount: function() {
		var self = this;
		this.gameState = new GameState();
		this.gameState.load();
		// this.gameState.availableCommands = {
		// 	home: new CommandCollection(),
		// 	play: new CommandCollection()
		// };
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

		this.gameState.on('exit', this.onExitGame);
		this.gameState.on('start', this.onStartLevel);
		this.gameState.on('change', this.onGameStateChanged);
		this.gameState.on('change:currentNode', this.onNodeChanged);
		this.gameState.on('closeModals', this.onCloseModals);
		this.gameState.availableCommands.home.on('add', this.onNewCommand);
		this.gameState.availableCommands.play.on('add', this.onNewCommand);
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
			this.setState({modals: {exit: true}});
		}
	},
	onConfirmExit: function() {
		this.setState({modals: {exit: false}});
		this.goHome();
	},
	onGameStateChanged: function() {
		this.gameState.save();
		renderTools.draw(
			this.stages[this.gameState.get('stage')],
			this.gameState
		);
	},
	onNewCommand: function() {
		this.gameState.save();
		this.forceUpdate();
	},
	onNodeChanged: function() {
		var self = this;
		var node = this.gameState.get('currentNode');

		if(!node) return;

		if(node.say.length) {
			var say = node.say.shift();
			if(!say) return;
			var self = this;
			// hacky
			setTimeout(function() {
				self.gameState.get('character').say(say.message, say.danger);
			}, 100);
		}

		if(node.messages.length) {
			var message = node.messages.shift();
			if(!message) return;
			this.setState({modals: {message: message}});
		}

		if(node.items && node.items.length) {
			_.each(node.items, function(item) {
				self.gameState.availableCommands[self.gameState.get('stage')].add({id: item});
			});
			node.items = [];
			delete node._display;
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
			var newLevel = renderTools.loadFreshLevel(levels[e.node.levelName]);
			if(this.backgrounds.play) {
				this.stages.play.removeChild(this.backgrounds.play);
				this.backgrounds.play = null;
			}
			this.gameState.set({
				stage: 'play',
				level: newLevel,
				itemsCollected: 0,
				currentNode: newLevel.root
			});
			this.props.music.set({url: newLevel.music});
			this.forceUpdate();
		}
	},
	onPowerupModalOpen: function(command) {
		console.log('onPowerupModalOpen');
		var self = this;
		return function(e) {
			e.preventDefault();
			console.log('test');
			self.setState({modals: {powerup: powerups[command]}});
		};
	},
	onCloseModals: function() {
		this.setState({modals: this.getInitialState().modals});
	},
	cancelModal: function(name) {
		var self = this;
		return function(e) {
			var newState = { modals: {} };
			newState.modals[name] = false;
			self.setState(newState);
		}
	},
	goHome: function() {
		if(this.backgrounds.home) {
			this.stages.home.removeChild(this.backgrounds.home);
		}
		this.props.music.set({url: homeLevel.music});
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
		var self = this;
		if(this.gameState.get('stage') === 'play') {
			level = (
				<div className="level">
					<h4>Level {this.gameState.get('level').number}</h4>
					<h4 className="level-name">{this.gameState.get('level').name}</h4>
				</div>
			);
		}

		var powerupElements = this.gameState.availableCommands[this.gameState.get('stage')].map(function(pu) {
			if(!powerups.hasOwnProperty(pu.id)) {
				return <div key={pu.id}>bad powerup {pu.id}</div>
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
					<button type="button" className="info-btn" onClick={self.onPowerupModalOpen(pu.id)}></button>
				</div>
			);
		});
		var modal = null;
		if(this.state.modals.exit) {
			modal = (
				<Modal isOpen={this.state.modals.exit} gameState={this.gameState}>
					<div className="content">
						<h1>Are you sure you want to exit this level?</h1>
						<p>Renegade Rae needs your help! Are you sure you want to quit and leave her to fend for herself?</p>
					</div>
					<div className="buttons">
						<button type="button" className="btn" onClick={this.cancelModal('exit')}>Cancel</button>
						<button type="button" className="btn danger" onClick={this.onConfirmExit}>Quit</button>					
					</div>
				</Modal>
			);
		}
		else if(this.state.modals.powerup) {
			modal = (
				<Modal isOpen={this.state.modals.powerup} gameState={this.gameState}>
					<div className="content">
						<h1>{this.state.modals.powerup.command}</h1>
						<p dangerouslySetInnerHTML={{__html: this.state.modals.powerup.description}}></p>
					</div>
					<div className="buttons">
						<button type="button" onClick={this.cancelModal('powerup')} className="btn">Got it!</button>
					</div>
				</Modal>
			);
		}
		else if(this.state.modals.message) {
			modal = (
				<Modal isOpen={this.state.modals.message} gameState={this.gameState}>
					<div className="content">
						<h1 dangerouslySetInnerHTML={{__html: this.state.modals.message.title}}></h1>
						<p dangerouslySetInnerHTML={{__html: this.state.modals.message.body}}></p>
					</div>
					<div className="buttons">
						<button type="button" onClick={this.cancelModal('message')} className="btn">Cool!</button>
					</div>
				</Modal>
			);
		}
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
				{modal}
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
		this.animate();
	},
	componentDidUpdate: function() {
		this.refs.commandBox.getDOMNode().focus();
		if(this.props.page === 'game') {
			this.props.music.set({ url: this.gameState.get('level').music });
		}
	},
	animate: function() {
		// start the timer for the next animation loop
		requestAnimationFrame(this.animate);

		this.renderer.render(
			this.stages[this.gameState.get('stage')]
		);
	}
});
