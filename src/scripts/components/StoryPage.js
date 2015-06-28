var React = require('react');
// var $ = require('jquery');

module.exports = React.createClass({
	componentDidMount: function() {
		// $('#typed').typed({
		// 		strings: ["This is where the story goes. It will explain the game. Have fun!"],
		// 		typeSpeed: 50,
		// 		loop: false,
		// 		loopCount: false
		// });
	},
	render: function() {
		return (
			<section id="wrapper">
				<section id="typed">
					<a href="#game">Play Game</a>
				</section>
			</section>
		);
	}
});