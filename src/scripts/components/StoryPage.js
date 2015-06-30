var React = require('react');
var $ = require('jquery');
window.jQuery = $;
require('typed.js');

module.exports = React.createClass({
	componentDidMount: function() {
		$('#typed').typed({
				strings: ["This is where the story goes. It will explain the game. Have fun!"],
				typeSpeed: 50,
				loop: false,
				loopCount: false
		});
	},
	render: function() {
		return (
			<section id="wrapper">
				<section id="typed">
					<div id="header-img">
						<img src="/images/story_page_banner.png" />
					</div>
					<p>
						Lightyears away, in the deepest depths of the galaxy...
					</p>
					<a href="#game">Play Game</a>
				</section>
			</section>
		);
	}
});