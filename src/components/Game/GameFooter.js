import React from 'react';
import PropTypes from 'prop-types';

import { TOGGLE_VISIBILITY } from '../../constants/chatActionTypes';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
	...state.game
});

const mapDispatchToProps = dispatch => ({
	toggleVisibility: () => dispatch({ type: TOGGLE_VISIBILITY })
});

class GameHeader extends React.PureComponent {
	static propTypes = {
		io: PropTypes.object.isRequired,
		params: PropTypes.array.isRequired,
		color: PropTypes.oneOf(['white', 'black']).isRequired,
		openModal: PropTypes.func.isRequired,
		gameOver: PropTypes.bool.isRequired,
		isOpponentAvailable: PropTypes.bool.isRequired
	};

	_onResign() {
		const { io, params, color } = this.props;

		io.emit('resign', {
			token: params[0],
			color: color
		});
	}
	_onRematch() {
		const { io, params, openModal, isOpponentAvailable } = this.props;
		debugger;

		if (!isOpponentAvailable) {
			openModal('info', 'Your opponent has disconnected. You need to ' + 'generate a new link.');
			return;
		}

		io.emit('rematch-offer', {
			token: params[0]
		});
		openModal('info', 'Your offer has been sent.');
	}

	constructor(props) {
		super(props);
		this._onResign = this._onResign.bind(this);
		this._onRematch = this._onRematch.bind(this);
	}

	render() {
		const { gameOver, isOpponentAvailable, unseenCount } = this.props;

		return (
			<footer className="clearfix">
				<div>
					{/* <span id="game-type">{`${params[1]}|${params[2]}`}</span> */}

					<a className="btn" href="/game">
						New game
					</a>

					{!gameOver && isOpponentAvailable ? (
						<a className="btn btn--red resign" onClick={this._onResign}>
							Resign
						</a>
					) : gameOver ? (
						<a className="btn btn--red rematch" onClick={this._onRematch}>
							Rematch
						</a>
					) : null}

					<a id="chat-icon" onClick={this.props.toggleVisibility}>
						{unseenCount ? <span id="chat-counter">{unseenCount < 9 ? unseenCount : '9+'}</span> : null}
						<img src={require('../../assets/images/chat.svg')} width="50" height="50" />
						Chat
					</a>
				</div>
			</footer>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GameHeader);
