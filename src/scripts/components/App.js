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
		var music = new MusicModel();
		var Router = Backbone.Router.extend({
			routes: {
				'': 'story',
				'game': 'game'
			},
			story: function() {
				music.set({ url: '/music/story_and_home.mp3'});
				self.setState({page: 'story'});
			},
			game: function() {
				self.setState({page: 'game'});
			}
		});

		return {
			router: new Router({setState: self.setState}),
			page: 'story',
			music: music
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
					<StoryPage page={this.state.page} music={this.state.music} />
				</div>
				<div style={gameStyle}>
					<GamePage ref="game" page={this.state.page} music={this.state.music} />
				</div>
			</main>
		);
	},
	onAppClick: function() {
		this.refs.game.refs.commandBox.focus()
	}
});