var Backbone = require('backbone');
Backbone.$ = require('jquery');
var CommandModel = require('../models/CommandModel');
module.exports = Backbone.Collection.extend({
	model: CommandModel
})