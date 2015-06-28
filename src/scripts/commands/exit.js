module.exports = {
	getPath: function() {
		return false;
	},
	run: function(args, gameState) {
		gameState.trigger('exit');
	}
};