import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WithMoveValidation from '../DraughtsBoard/integrations/WithMoveValidation';
import { MAKE_MOVE, GAME_OVER } from '../../constants/gameActionTypes';

const mapStateToProps = state => ({
	...state.game
});

const mapDispatchToProps = dispatch => ({
	gameOver: payload => dispatch({ type: GAME_OVER, payload }),
	makeMove: payload => dispatch({ type: MAKE_MOVE, payload })
});

class GameBoard extends React.PureComponent {
	static propTypes = {
		io: PropTypes.object.isRequired,
		token: PropTypes.string.isRequired,
		maybePlaySound: PropTypes.func.isRequired,
		color: PropTypes.oneOf(['white', 'black']).isRequired,
		gameOver: PropTypes.bool.isRequired,
		isOpponentAvailable: PropTypes.bool.isRequired
	};

	_onNewMove(move) {
		const { io, token } = this.props;

		io.emit('new-move', {
			token: token,
			move: move
		});
	}

	_runClock() {
		const { io, token, turn } = this.props;

		io.emit('clock-run', {
			token: token,
			color: turn === 'w' ? 'white' : 'black'
		});
	}

	constructor(props) {
		super(props);
		this.state = {
			position: 'start'
		};
		this._onNewMove = this._onNewMove.bind(this);
		this._runClock = this._runClock.bind(this);
		this.onDrop = this.onDrop.bind(this);
	}

	componentDidMount() {
		const { io } = this.props;
		let self = this;
		io.on('move', data => {
			self.props.makeMove(data);
			// if (!data.gameOver) {
			self._runClock();
			// }
		});
	}

	componentDidUpdate() {
		let { turn, lastMove, _gameOver } = this.props;
		if (turn && lastMove.get('from') && lastMove.get('to')) {
			this._onNewMove({ from: lastMove.get('from'), to: lastMove.get('to'), gameOver: _gameOver });
		}
		this.setState({ position: this.props.fen });
	}

	onDrop(from, to, piece) {
		if (piece === (this.props.color === 'white' ? 'w' : 'b') && piece === this.props.turn) {
			this.props.makeMove({ from, to, piece });
		}
	}

	render() {
		return (
			<div className="container">
				<WithMoveValidation onDrop={this.onDrop} position={this.state.position} orientation={this.props.color} />
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GameBoard);
