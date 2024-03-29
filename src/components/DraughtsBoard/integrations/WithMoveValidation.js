import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { Draughts } from '../gameEngine/index';

import Draughtsboard from '../../DraughtsBoard';

class HumanVsHuman extends Component {
	static propTypes = { children: PropTypes.func };

	state = {
		fen: 'start',
		// square styles for active drop squares
		dropSquareStyle: {},
		// custom square styles
		squareStyles: {},
		// square with the currently clicked piece
		pieceSquare: '',
		// currently clicked square
		square: '',
		history: []
	};

	componentDidMount() {
		this.game = new Draughts();
	}

	// keep clicked square style and remove hint squares
	removeHighlightSquare = () => {
		this.setState(({ pieceSquare, history }) => ({
			squareStyles: squareStyling({ pieceSquare, history })
		}));
	};

	// show possible moves
	highlightSquare = (sourceSquare, squaresToHighlight) => {
		const highlightStyles = [...squaresToHighlight].reduce((a, c) => {
			return {
				...a,
				...{
					[c]: {
						background: 'radial-gradient(circle, #fffc00 36%, transparent 40%)',
						borderRadius: '50%'
					}
				},
				...squareStyling({
					history: this.state.history,
					pieceSquare: this.state.pieceSquare
				})
			};
		}, {});

		this.setState(({ squareStyles }) => ({
			squareStyles: { ...squareStyles, ...highlightStyles }
		}));
	};

	onDrop = ({ sourceSquare, targetSquare, piece }) => {
		// see if the move is legal
		let move = this.game.move({
			from: sourceSquare,
			to: targetSquare
		});

		// illegal move
		if (move === null) return;
		this.setState(({ history, pieceSquare }) => ({
			fen: this.game.fen(),
			history: this.game.history({ verbose: true }),
			squareStyles: squareStyling({ pieceSquare, history })
		}));
		this.props.onDrop(sourceSquare, targetSquare, piece);
	};

	onMouseOverSquare = (square, color) => {
		// get list of possible moves for this square
		let moves = this.game.moves({
			square: square,
			verbose: true
		});

		// exit if there are no moves available for this square
		if (moves.length === 0) return;

		let squaresToHighlight = [];
		for (var i = 0; i < moves.length; i++) {
			squaresToHighlight.push(moves[i].to);
		}

		color === 'black' && this.highlightSquare(square, squaresToHighlight);
	};

	onMouseOutSquare = square => this.removeHighlightSquare(square);

	// central squares get diff dropSquareStyles
	onDragOverSquare = square => {
		this.setState({
			dropSquareStyle: false ? { backgroundColor: 'cornFlowerBlue' } : { boxShadow: 'inset 0 0 1px 4px rgb(255, 255, 0)' }
		});
	};

	onSquareClick = square => {
		this.setState(({ history }) => ({
			squareStyles: squareStyling({ pieceSquare: square, history }),
			pieceSquare: square
		}));

		let move = this.game.move({
			from: this.state.pieceSquare,
			to: square
		});

		// illegal move
		if (move === null) return;

		this.setState({
			fen: this.game.fen(),
			history: this.game.history({ verbose: true }),
			pieceSquare: ''
		});
	};

	onSquareRightClick = square =>
		this.setState({
			squareStyles: { [square]: { backgroundColor: 'deepPink' } }
		});

	render() {
		const { fen, dropSquareStyle, squareStyles } = this.state;

		return this.props.children({
			squareStyles,
			position: fen,
			onMouseOverSquare: this.onMouseOverSquare,
			onMouseOutSquare: this.onMouseOutSquare,
			onDrop: this.onDrop,
			dropSquareStyle,
			onDragOverSquare: this.onDragOverSquare,
			onSquareClick: this.onSquareClick,
			onSquareRightClick: this.onSquareRightClick
		});
	}
}

export default function WithMoveValidation(props) {
	return (
		<div>
			<HumanVsHuman onDrop={props.onDrop}>
				{({
					position,
					onDrop,
					onMouseOverSquare,
					onMouseOutSquare,
					squareStyles,
					dropSquareStyle,
					onDragOverSquare,
					onSquareClick,
					onSquareRightClick
				}) => (
					<Draughtsboard
						id="humanVsHuman"
						calcWidth={({ screenWidth }) => (screenWidth < 500 ? screenWidth : 480)}
						position={props.position || position}
						orientation={props.orientation}
						onDrop={onDrop}
						onMouseOverSquare={onMouseOverSquare}
						onMouseOutSquare={onMouseOutSquare}
						boardStyle={{
							borderRadius: '5px',
							boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
						}}
						squareStyles={squareStyles}
						dropSquareStyle={dropSquareStyle}
						onDragOverSquare={onDragOverSquare}
						onSquareClick={onSquareClick}
						onSquareRightClick={onSquareRightClick}
					/>
				)}
			</HumanVsHuman>
		</div>
	);
}

const squareStyling = ({ pieceSquare, history }) => {
	const sourceSquare = history.length && history[history.length - 1].from;
	const targetSquare = history.length && history[history.length - 1].to;

	return {
		[pieceSquare]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
		...(history.length && {
			[sourceSquare]: {
				backgroundColor: 'rgba(255, 255, 0, 0.4)'
			}
		}),
		...(history.length && {
			[targetSquare]: {
				backgroundColor: 'rgba(255, 255, 0, 0.4)'
			}
		})
	};
};
