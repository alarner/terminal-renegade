var React = require('react');
var buzz = require('buzz');
var globals = require('../globals');

module.exports = React.createClass({
	componentWillMount: function() {
		this.props.music.on('change:on', this.onMusicStatusChange);
		this.props.music.on('change:url', this.onMusicUrlChange);

		this.music = {};

		this.onMusicUrlChange();
		this.onMusicStatusChange();
	},
	render: function() {
		return (
			<button
				type="button"
				className={'music-control '+(this.props.music.get('on') ? 'on' : 'off')}
				onClick={this.toggle}>
			</button>
		);
	},
	toggle: function() {
		this.props.music.set({ on: !this.props.music.get('on') });
		this.forceUpdate();
	},
	getMusic: function(url) {
		if(!url) return false;
		if(!this.music.hasOwnProperty(url)) {
			this.music[url] = new buzz.sound(
				url,
				{preload: true, loop: true}
			);
		}
		return this.music[url];
	},
	onMusicStatusChange: function() {
		var music = this.getMusic(this.props.music.get('url'));
		if(!music) return;
		if(this.props.music.get('on')) {
			music.fadeIn(globals.music.fadeTime);
		}
		else {
			music.fadeOut(globals.music.fadeTime);
		}
	},
	onMusicUrlChange: function() {
		var newUrl = this.props.music.get('url');
		if(!newUrl) return;
		if(!this.props.music.get('on')) return;

		var oldUrl = this.props.music.previous('url');
		var newMusic = this.getMusic(newUrl);
		var oldMusic = this.getMusic(oldUrl);

		newMusic.fadeIn(globals.music.fadeTime);
		if(oldMusic) {
			oldMusic.fadeOut(globals.music.fadeTime);
		}
	}
});