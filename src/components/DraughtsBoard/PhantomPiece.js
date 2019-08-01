import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

import { renderPiece } from './Piece';
import { ROWS } from './helpers';

PhantomPiece.propTypes = {
  width: PropTypes.number,
  phantomPieceValue: PropTypes.string,
  pieces: PropTypes.object,
  allowDrag: PropTypes.func
};

function PhantomPiece({ width, pieces, phantomPieceValue, allowDrag }) {
  return renderPiece({
    width,
    pieces,
    piece: phantomPieceValue,
    phantomPieceStyles: phantomPieceStyles(width),
    allowDrag
  });
}

export default PhantomPiece;

const phantomPieceStyles = width => ({
  position: 'absolute',
  width: width / ROWS,
  height: width / ROWS,
  zIndex: 1
});
