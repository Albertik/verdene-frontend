import React from 'react';
import ReactModal from 'react-modal';

class GameOverModal extends React.PureComponent {
	constructor(props) {
		super(props);
		this.handleCloseModal = this.handleCloseModal.bind(this);
	}

	handleCloseModal() {
		this.props.onHide();
	}

	render() {
		let { data } = this.props;

		return (
			<ReactModal
				isOpen={data && data.get('open')}
				shouldCloseOnOverlayClick={true}
				className="Modal"
				overlayClassName="Overlay"
				onRequestClose={this.handleCloseModal}
			>
				<h1 id="heading">Game Over!</h1>
				<div id="full_description">
					<p>{data.get('message')}</p>
					<p>{this.props._gameOver.get('winner')} wins!</p>
					<button onClick={this.handleCloseModal} className="btn ReactModal_alert-btn">
						OK
					</button>
				</div>
			</ReactModal>
		);
	}
}

export default GameOverModal;
