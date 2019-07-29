import {List, Map} from 'immutable';
import _ from 'lodash';
import { MAKE_MOVE, REMATCH, GAME_OVER } from '../constants/gameActionTypes';
import { Draughts } from '../helpers/draughts';
var DraughtsGame = new Draughts();
window.DraughtsGame = DraughtsGame;

var _gameOver;
var _moves;
var _turn;
var _lastMove;

function setInitialState() {
  _gameOver = Map({
    status: false,
    type: null,
    winner: null
  });
  _moves = List();
  _turn = 'w';
  _lastMove = Map();
  return {
    _gameOver,
    moves: _moves,
    turn: _turn,
    lastMove: _lastMove,
    fen: DraughtsGame.fen(),
    pdn: DraughtsGame.pdn()
  }
}

function makeMove(from, to, piece, position) {
  if (from == to) return;

  //todo: validate move
  // let move = _.find(DraughtsGame.moves(), { from: parseInt(window.currentMove.from), to: parseInt(window.currentMove.to) });
  console.log('onDrop', from, to, piece, position);

  // if (move) {
  // 	DraughtsGame.move(move);
  // 	console.log(DraughtsGame.ascii());
  // } else {
  // 	window.game.position(DraughtsGame.fen());
  // }
  let legalMoves = DraughtsGame.getLegalMoves(from);
  let move = _.find(legalMoves, { from: parseInt(from, 10), to: parseInt(to, 10) });

  if (!move) {
    // move is not valid, return false and don't emit any event.
    return false;
  }

  DraughtsGame.move(move);
  if (move.takes.length > 0) {
    _.forEach(move.takes, take => {
      DraughtsGame.remove('' + take);
    });
  }

  console.log(DraughtsGame.ascii());

  _turn = DraughtsGame.turn();
  _lastMove = _lastMove.set('from', from).set('to', to);
  _moves = _moves.isEmpty() || _moves.last().size === 2 ?
    _moves.push(List([move.san])) :
    _moves.update(_moves.size - 1, list => list.push(move.san));

  if (DraughtsGame.gameOver()) {
    debugger;

    gameOver({
      winner: _turn === 'b' ? 'White' : 'Black',
      type: 'type?'
    });
  }

  return {
    from: from,
    to: to,
    fen: DraughtsGame.fen(),
    pdn: DraughtsGame.pdn()
  };
}

function gameOver(options) {
  _gameOver = _gameOver
    .set('status', options.status)
    .set('winner', options.winner)
    .set('type', options.type);
}

export default (
	state = setInitialState(),
	action
) => {
	switch (action.type) {
    case MAKE_MOVE:
      let {from, to, piece, d} = action.payload;
      let move = makeMove(from, to, piece, d);
      if (move) {
        return {...state, ...move, _gameOver, turn: _turn, lastMove:  _lastMove};
      }
		case REMATCH:
    case GAME_OVER:
      gameOver(action.payload)
      return {...state, _gameOver};

		default:
			return state;
	}
};
