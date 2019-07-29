import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { omit } from 'lodash';

import DraughtsBoard from './GameBoard';
// import CapturedPieces from './CapturedPieces';
// import TableOfMoves from './TableOfMoves';

const mapStateToProps = state => ({
	...state.game
});

class DraughtsboardInterface extends React.PureComponent {
	static propTypes = {
		io: PropTypes.object.isRequired,
		token: PropTypes.string.isRequired,
		soundsEnabled: PropTypes.bool.isRequired,
		color: PropTypes.oneOf(['white', 'black']).isRequired,
		gameOver: PropTypes.object.isRequired,
		isOpponentAvailable: PropTypes.bool.isRequired
	};

	_maybePlaySound() {
		if (this.props.soundsEnabled) {
			this.refs[this.state.check ? 'checkSnd' : 'moveSnd'].getDOMNode().play();
		}
	}
	_getGameOverMessage() {
		const type = this.props.gameOver.get('type');
		const winner = this.props.gameOver.get('winner');
		const loser = winner === 'White' ? 'Black' : 'White';

		return type === 'timeout'
			? `${loser}‘s time is out. ${winner} wins!`
			: type === 'resign'
			? `${loser} has resigned. ${winner} wins!`
			: type === 'draw'
			? 'Draw.'
			: type === 'threefoldRepetition'
			? 'Draw (Threefold Repetition).'
			: type === 'insufficientMaterial'
			? 'Draw (Insufficient Material)'
			: '';
	}

	constructor(props) {
		super(props);
		this._maybePlaySound = this._maybePlaySound.bind(this);
		this._getGameOverMessage = this._getGameOverMessage.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.gameOver.get('status') && !prevProps.gameOver.get('status')) {
			this.props.openModal('info', this._getGameOverMessage());
		}
	}
	render() {
		const { turn, gameOver } = this.props;

		return (
			<div id="board-moves-wrapper" className="clearfix">
				<audio preload="auto" ref="moveSnd">
					<source src="/snd/move.mp3" />
				</audio>

				<div id="board-wrapper">
					<DraughtsBoard
						{...omit(this.props, 'soundsEnabled', 'gameOver')}
						gameOver={gameOver.get('status')}
						maybePlaySound={this._maybePlaySound}
					/>
				</div>

				<span className="feedback">
					{!gameOver.get('status') ? (
						<span>
							{`${turn === 'w' ? 'White' : 'Black'} to move.`}
							{/* {check ? <strong> Check.</strong> : null} */}
						</span>
					) : (
						<strong>
							{/* <span className="icon">
                {gameOver.get('winner') === 'White' ? 'F' : 'f'}
              </span> */}
							{this._getGameOverMessage()}
						</strong>
					)}
				</span>
			</div>
		);
	}
}

export default connect(
	mapStateToProps,
	null
)(DraughtsboardInterface);
