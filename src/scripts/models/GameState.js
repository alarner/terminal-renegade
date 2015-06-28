var Backbone = require('backbone');
Backbone.$ = require('jquery');
module.exports = Backbone.Model.extend({
	defaults: {
		currentStage: 'home',
		currentNode: null,
		itemsCollected: 0,
		history: [],
		commandsAvailable: ['cd'],
		level: null
	}
})