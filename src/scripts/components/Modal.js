var React = require('react');
var Modal = require('react-modal');
Modal.setAppElement(document.body);

module.exports = React.createClass({
	render: function() {
		return (
			<Modal isOpen={this.props.isOpen ? true : false} onRequestClose={this.close}>
				<div className="Inner_border">
					{this.props.children}
				</div>
			</Modal>
		);
	},
	close: function() {
		this.props.gameState.trigger('closeModals');
	}
});