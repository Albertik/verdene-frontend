import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';

import GameHeader from './GameHeader';
import Chat from './Chat';
import { GAME_OVER, REMATCH } from '../../constants/gameActionTypes';
import { connect } from 'react-redux';
import DraughtsboardInterface from './DraughtsboardInterface';
import GameOverModal from './GameOverModal';
import GameFooter from './GameFooter';

const mapStateToProps = state => ({
	...state.game
});

const mapDispatchToProps = dispatch => ({
	// toggleVisibility: () => dispatch({ type: TOGGLE_VISIBILITY })
	gameOver: payload => dispatch({ type: GAME_OVER, payload }),
	rematch: () => dispatch({ type: REMATCH })
});

class GameInterface extends React.Component {
	static propTypes = {
		io: PropTypes.object.isRequired,
		params: PropTypes.array.isRequired
	};

	_openModal(type, message) {
		this.setState({
			modal: this.state.modal
				.set('open', true)
				.set('message', message)
				.set('type', type)
		});
	}
	_hideModal() {
		this.setState({ modal: this.state.modal.set('open', false) });
	}
	_acceptRematch() {
		const { io, params } = this.props;

		io.emit('rematch-accept', {
			token: params[0],
			time: params[1] * 60,
			inc: params[2]
		});
		this._hideModal();
	}
	_declineRematch() {
		const { io, params } = this.props;

		io.emit('rematch-decline', {
			token: params[0]
		});
		this._hideModal();
	}

	constructor(props) {
		super(props);
		this._openModal = this._openModal.bind(this);
		this._hideModal = this._hideModal.bind(this);
		this._acceptRematch = this._acceptRematch.bind(this);
		this._declineRematch = this._declineRematch.bind(this);
		this.state = {
			isOpponentAvailable: false,
			color: 'white',
			modal: Map({
				open: false,
				message: '',
				type: 'info',
				callbacks: {
					hide: this._hideModal,
					accept: this._acceptRematch,
					decline: this._declineRematch
				}
			}),
			soundsEnabled: false,
			gameOver: this.props._gameOver
		};
	}

	componentDidMount() {
		const { io, params } = this.props;

		io.on('token-invalid', () =>
			this.setState({
				modal: this.state.modal
					.set('open', true)
					.set('message', 'Game link is invalid or has expired.')
					.set('type', 'info')
			})
		);

		io.emit('join', {
			token: params[0],
			time: params[1] * 60,
			inc: params[2]
		});

		io.on('joined', data => {
			if (data.color === 'black') {
				this.setState({ color: 'black' });
			}
		});

		io.on('both-joined', () =>
			this.setState({ isOpponentAvailable: true }, () => {
				if (this.state.color === 'white') {
					io.emit('clock-run', {
						token: params[0],
						color: 'white'
					});
				}
			})
		);

		io.on('full', () => {
			// window.alert('This game already has two players. You have to create a new one.');
			// window.location = '/game';
		});

		io.on('player-resigned', data => {
			this.props.gameOver({
				type: 'resign',
				winner: data.color === 'black' ? 'White' : 'Black'
			});
			this.setState({
				modal: this.state.modal
					.set('open', true)
					.set('message', 'Your opponent resigned. You win!')
					.set('type', 'info')
			});
		});

		io.on('countdown-gameover', data => {
			this.setState({
				modal: this.state.modal
					.set('open', true)
					.set('message', 'Exceeded time!')
					.set('type', 'info')
			});
		});

		io.on('rematch-offered', () => this._openModal('offer', 'Your opponent has sent you a rematch offer.'));

		io.on('rematch-declined', () => this._openModal('info', 'Rematch offer has been declined.'));

		io.on('rematch-accepted', () => {
			this.props.rematch();
			this.setState(
				{
					color: this.state.color === 'white' ? 'black' : 'white',
					modal: this.state.modal.set('open', false)
				},
				() => {
					if (this.state.color === 'white') {
						io.emit('clock-run', {
							token: this.props.params[0],
							color: 'white'
						});
					}
				}
			);
		});

		io.on('opponent-disconnected', data => {
			this.props.gameOver({
				type: 'disconnected',
				winner: data.color === 'black' ? 'White' : 'Black'
			});
			this.setState({
				modal: this.state.modal
					.set('open', true)
					.set('message', 'Your opponent has disconnected.')
					.set('type', 'info')
			});

			this.setState({ isOpponentAvailable: false });
		});
	}

	render() {
		const { io, params } = this.props;
		const { color, soundsEnabled } = this.props;
		const commonProps = {
			io: io,
			color: color || this.state.color,
			openModal: this._openModal,
			isOpponentAvailable: this.state.isOpponentAvailable
		};

		return (
			<div id="game-container">
				<GameHeader {...commonProps} params={params} gameOver={this.props._gameOver.get('status')} />
				{/* <label id="sounds-label">
					<input type="checkbox" checked={soundsEnabled} onChange={this._toggleSounds} />
					<span> Enable sounds</span>
				</label> */}
				<DraughtsboardInterface {...commonProps} token={params[0]} soundsEnabled={soundsEnabled} gameOver={this.props._gameOver} />
				<GameFooter {...commonProps} params={params} gameOver={this.props._gameOver.get('status')} />
				<Chat {...commonProps} token={params[0]} soundsEnabled={soundsEnabled} />
				<GameOverModal {...this.props} data={this.state.modal} onHide={this._hideModal} />
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GameInterface);
