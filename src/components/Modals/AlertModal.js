import React from 'react';
import ReactModal from 'react-modal';

class AlertModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: true
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }
  
  handleCloseModal() {
    this.setState({isOpen: false});
  }

	render() {
		return (
			<ReactModal isOpen={this.state.isOpen} className="game-container Modal" overlayClassName="Overlay">
				<h1 id="heading">{this.props.heading}</h1>
				<div id="full_description">
					<button onClick={this.handleCloseModal} className="btn ReactModal_alert-btn">OK</button>
				</div>
			</ReactModal>
		);
	}
}

export default AlertModal;