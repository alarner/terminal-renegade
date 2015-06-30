var React = require('react');
var Modal = require('react-modal');
Modal.setAppElement(document.body);

module.exports = React.createClass({
	render: function() {
		return (
			<Modal isOpen={this.props.isOpen ? true : false}>
				<div className="Inner_border">
					{this.props.children}
				</div>
			</Modal>
		);
	}
});