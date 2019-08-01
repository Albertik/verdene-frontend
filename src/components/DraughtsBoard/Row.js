import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { COLUMNS, ROWS, deepCopy } from './helpers';


class Row extends Component {
  static propTypes = {
    width: PropTypes.number,
    orientation: PropTypes.string,
    boardStyle: PropTypes.object,
    children: PropTypes.func,
    boardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  render() {
    const { width, boardStyle, orientation, children, boardId } = this.props;
    let alpha = deepCopy(COLUMNS);
    let row = ROWS;
    let squareColor = 'white';

    if (orientation === 'black') {
      alpha.reverse();
      row = 1
    };

    return (
      <div
        style={{ ...boardStyles(width), ...boardStyle }}
        data-boardid={boardId}
      >
        {[...Array(ROWS)].map((_, r) => {
          orientation === 'black' ? row++ : row--;
          squareColor = (squareColor === 'white' ? 'black' : 'white')

          return (
            <div key={r.toString()} style={rowStyles(width)}>
              {[...Array(ROWS)].map((_, col) => {
                col++;
                let square =
                  orientation === 'black'
                    ? (parseInt(alpha[r], 10) * ROWS) + ((ROWS + 1) - col)
                    : (parseInt(alpha[r], 10) * ROWS) + col;
                square = Math.round(square / 2).toString();
                // if (col !== 0) {
                  squareColor = squareColor === 'black' ? 'white' : 'black';
                // }

                return children({ square, squareColor, col, row, alpha });
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Row;

const boardStyles = width => ({
  width,
  height: width,
  cursor: 'default'
});

const rowStyles = width => ({
  display: 'flex',
  flexWrap: 'nowrap',
  width
});