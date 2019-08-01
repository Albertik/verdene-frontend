import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import { ROWS } from './helpers';

class Notation extends PureComponent {
  static propTypes = {
    square: PropTypes.string,
    alpha: PropTypes.array,
    orientation: PropTypes.string,
    width: PropTypes.number,
    lightSquareStyle: PropTypes.object,
    darkSquareStyle: PropTypes.object
  };

  render() {
    const {
      lightSquareStyle,
      darkSquareStyle
    } = this.props;
    const whiteColor = lightSquareStyle.backgroundColor;
    const blackColor = darkSquareStyle.backgroundColor;

    return renderBottomLeft(this.props, { whiteColor });

    return null;
  }
}

export default Notation;

/* eslint react/prop-types: 0 */
function renderBottomLeft(
  { orientation, square, width, alpha },
  { whiteColor }
) {
  return (
    <Fragment>
      <div
        data-testid={`bottom-left-${square}`}
        style={{
          ...notationStyle,
          ...{ fontSize: width / 48, color: whiteColor },
          ...alphaStyle(width)
        }}
      >
        {square}
      </div>
    </Fragment>
  );
}

const alphaStyle = width => ({
  alignSelf: 'flex-end',
  paddingLeft: width / ROWS - width / 48
});

const notationStyle = {
  fontFamily: 'Helvetica Neue',
  zIndex: 3,
  position: 'absolute'
};
