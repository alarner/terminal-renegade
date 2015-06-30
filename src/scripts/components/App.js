var React = require('react');
var GamePage = require('./GamePage');
var StoryPage = require('./StoryPage');
var MusicControl = require('./MusicControl');
var Backbone = require('backbone');
var MusicModel = require('../models/MusicModel');
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
			page: 'story',
			music: new MusicModel()
		}
	},
	componentDidMount: function() {
		Backbone.history.start();
	},
	render: function() {
		var storyStyle = {
			display: this.state.page === 'story' ? 'block' : 'none'
		};
		var gameStyle = {
			display: this.state.page === 'game' ? 'block' : 'none'
		};
		return (
			<main onClick={this.onAppClick}>
				<MusicControl music={this.state.music} />
				<div style={storyStyle}>
					<StoryPage music={this.state.music} />
				</div>
				<div style={gameStyle}>
					<GamePage ref="game" music={this.state.music} />
				</div>
			</main>
		);
	},
	onAppClick: function() {
		this.refs.game.refs.commandBox.focus()
	}
});