import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { DraughtsBoard } from '../../helpers/DraughtsBoard';
import { MAKE_MOVE, GAME_OVER } from '../../constants/gameActionTypes';

const mapStateToProps = state => ({
	...state.game
});

const mapDispatchToProps = dispatch => ({
	gameOver: payload => dispatch({ type: GAME_OVER, payload}),
	makeMove: payload => dispatch({ type: MAKE_MOVE, payload})
});


class GameBoard extends React.PureComponent {

	static propTypes = {
    io: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    maybePlaySound: PropTypes.func.isRequired,
    color: PropTypes.oneOf(['white', 'black']).isRequired,
    gameOver: PropTypes.bool.isRequired,
    isOpponentAvailable: PropTypes.bool.isRequired
  }

	_onNewMove(move) {
		const {io, token} = this.props;
		this.game.position(this.props.fen);

    io.emit('new-move', {
      token: token,
      move: move
    });
  }

	_runClock() {
		const {io, token, color} = this.props;

    io.emit('clock-run', {
      token: token,
      color: color
    });
  }

	constructor(props) {
		super(props);
		this.state = {
			flipped: false
		};
		this.start = this.start.bind(this);
		this.flip = this.flip.bind(this);
		// this.undo = this.undo.bind(this);
		this._onNewMove = this._onNewMove.bind(this);
		this._runClock = this._runClock.bind(this);
	}

	componentDidMount() {
		const {io} = this.props;
		let self = this;
		io.on('move', data => {
			self.props.makeMove(data);
      // if (!data.gameOver) {
        self._runClock();
      // }
    });

		window.$el = this.$el = $(this.el);
		window.currentMove = {
			from: null,
			to: null
		};
		window.game = this.game = new DraughtsBoard(this.$el, {
			position: 'start',
			pieceTheme: '{piece}.svg',
			showNotation: false,
			draggable: true,
			onDrop(from, to, piece, d) {
				let currentPlayerColor = self.props.color === 'white' ? 'w' : 'b';
				if (currentPlayerColor != piece || self.props.turn != piece) {
					setTimeout(() => self.game.position(self.props.fen), 50);
					return;
				};
				self.props.makeMove({from, to, piece, d})
				// self.setState({ fen: DraughtsGame.fen(), pdn: DraughtsGame.pdn(), turn: DraughtsGame.turn() });
			}
		});
	}

	componentDidUpdate() {
		let {turn, lastMove, _gameOver, color} = this.props;
		if (color === 'black' && !this.state.flipped) {
			this.flip();
		}
		if (turn && lastMove.get('from') && lastMove.get('to')) {
			this._onNewMove({from: lastMove.get('from'), to: lastMove.get('to'), gameOver: _gameOver});
		}
	}

	start() {
		this.game.position();
		this.game.start(true);
	}

	flip() {
		this.setState({flipped: !this.state.flipped});
		this.game.flip();
	}

	// undo() {
	// 	DraughtsGame.undo();
	// 	this.game.position(DraughtsGame.fen());
	// 	this.setState({ fen: DraughtsGame.fen(), pdn: DraughtsGame.pdn(), turn: DraughtsGame.turn() });
	// }

	render() {
		return (
			<div className="container">
				<div
					ref={el => {
						this.el = el;
					}}
				/>
				{/* <button onClick={this.start}>Start</button> */}
				<button onClick={this.flip}>Flip</button>
				{/* <button onClick={this.undo}>Undo</button> */}
				<pre>{this.props.pdn}</pre>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(GameBoard);
