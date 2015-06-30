var React = require('react');

module.exports = React.createClass({
	getInitialState: function() {
		return { on: true }
	},
	componentDidMount: function() {
		Backbone.history.start();
	},
	render: function() {
		return (
			<button type="button" className="music-control">

			</button>
		);
	},
	onAppClick: function() {
		this.refs.game.refs.commandBox.focus()
	}
});