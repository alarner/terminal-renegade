var Backbone = require('backbone');
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
	}
})