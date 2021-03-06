var Backbone = require('backbone');
var CommandCollection = require('../collections/CommandCollection');
// var commandTools = require('../libs/command-tools');
Backbone.$ = require('jquery');
module.exports = Backbone.Model.extend({
	defaults: {
		stage: 'home',
		currentNode: null,
		goalsComplete: 0,
		history: [],
		level: null,
		character: null,
		message: false
	},
	save: function() {
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
	}
})