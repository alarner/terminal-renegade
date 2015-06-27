var React = require('react');
var GamePage = require('./GamePage');
var StoryPage = require('./StoryPage');
var Backbone = require('backbone');
Backbone.$ = require('jquery');

module.exports = React.createClass({
	getInitialState: function() {
		var self = this;
		var Router = Backbone.Router.extend({
			routes: {
				'': 'story',
				'game': 'game'
			},
			story: function() {
				self.setState({page: 'story'});
			},
			game: function() {
				self.setState({page: 'game'});
			}
		});

		return {
			router: new Router({setState: self.setState}),
			page: 'story'
		}
	},
	componentDidMount: function() {
		Backbone.history.start();
	},
	render: function() {
		console.log('render', this.state.page);
		var storyStyle = {
			display: this.state.page === 'story' ? 'block' : 'none'
		};
		var gameStyle = {
			display: this.state.page === 'game' ? 'block' : 'none'
		};
		return (
			<main>
				<div style={storyStyle}>
					<StoryPage />
				</div>
				<div style={gameStyle}>
					<GamePage />
				</div>
			</main>
		);
	}
});