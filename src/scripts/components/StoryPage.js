var React = require('react');
var $ = require('jquery');
window.jQuery = $;
require('typed.js');

module.exports = React.createClass({
	componentDidMount: function() {
		console.log('test');
		var date = new Date();
		var $typed = $(this.refs.typed.getDOMNode());
		var $scroll = $(this.refs.typedScroll.getDOMNode())
		$typed.typed({
			strings: ['\
Light years away, in the deepest depths of the\n\
galaxy, Rae, a renegade of the planet Terminal\n\
fights with her band of galaxy guerrillas to\n\
overthrow planet Terminal’s tyrant, Commander\n\
Sudo!!^1000 (pronounced sudo bang bang!)^2000\n\
\n\
A stealth mission to infiltrate the depths of\n\
Commander Sudo !!’s headquarters, lead to\n\
Rae’s capture and banishment to the prison\n\
ship, BASH. Now she must use her strength,\n\
agility, and above all, her intellect to escape\n\
from BASH and face the Commander before\n\
all hope for planet Terminal is lost!'],
			typeSpeed: 0,
			loop: false,
			loopCount: false,
			onStringTyped: function() {
				clearInterval(intervalId);
				$scroll.off();
			}
		});
		
		var intervalId = setInterval(function() {
			$scroll.scrollTop($typed.height());
		}, 100);

		$scroll.scroll(function(e) {
			$scroll.scrollTop($typed.height());
		});
	},
	render: function() {
		return (
			<section className="story-page">
				<div className="header-img">
					<img src="/images/story_page_banner.png" />
				</div>
				<div className="typed-mask">
					<div className="typed-scroll" ref="typedScroll">
						<p ref="typed"></p>
					</div>
				</div>
				<a href="#game">Play Game</a>
			</section>
		);
	}
});