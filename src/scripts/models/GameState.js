var Backbone = require('backbone');
var CommandCollection = require('../collections/CommandCollection');
// var commandTools = require('../libs/command-tools');
Backbone.$ = require('jquery');
module.exports = Backbone.Model.extend({
	defaults: {
		stage: 'home',
		currentNode: null,
		itemsCollected: 0,
		history: [],
		level: null,
		character: null,
		message: false
	},
	save: function() {
		console.log('GameState save');
		// var obj = this.toJSON();
		// delete obj.character;
		// delete obj.level;
		// obj.history = obj.history.slice(0, 50); // only store last 50
		// obj.currentNode = commandTools.getPathFromNode(obj.currentNode);
		var obj = {
			availableCommands: {
				home: this.availableCommands.home.toJSON(),
				play: this.availableCommands.play.toJSON()
			}
		}
		window.localStorage.setItem('gameState', JSON.stringify(obj));
	},
	load: function() {
		var obj = window.localStorage.getItem('gameState');
		obj = JSON.parse(obj);
		if(!obj) {
			this.availableCommands = {
				home: new CommandCollection(),
				play: new CommandCollection()
			}
		}
		else {
			this.availableCommands = {
				home: new CommandCollection(obj.availableCommands.home),
				play: new CommandCollection(obj.availableCommands.play)
			}
		}
		console.log(obj);
	}
})