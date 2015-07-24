var Backbone = require('backbone');
Backbone.$ = require('jquery');
module.exports = Backbone.Model.extend({
	defaults: {
		url: '',
		on: false
	}
})