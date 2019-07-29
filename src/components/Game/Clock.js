import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GAME_OVER } from '../../constants/gameActionTypes';

const mapStateToProps = state => ({
	...state.game
});

const mapDispatchToProps = dispatch => ({
	gameOver: payload => dispatch({ type: GAME_OVER, payload})
});

class Clock extends React.PureComponent {
  static propTypes = {
    io: PropTypes.object.isRequired,
    params: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    const [_, time, inc] = this.props.params;
    this.state = {
      white: time * 60,
      black: time * 60,
      inc: inc,
      countdown: null
    }
  }

  componentDidMount() {
    const io = this.props.io;

    io.on('countdown', data => {
      this.setState({
      [data.color]: data.time,
      countdown: data.color
    })});

    io.on('countdown-gameover', data => {
      this.setState({countdown: null});
      this.props.gameOver({
        type: 'timeout',
        winner: data.color === 'black' ? 'White' : 'Black'
      });
    });

    io.on('rematch-accepted', () => {
      this.setState({
        white: this.props.params[1] * 60,
        black: this.props.params[1] * 60
      });
    });
  }

  render() {
    return (
      <ul id="clock">
        <Timer
          color="white"
          time={this.state.white}
          countdown={this.state.countdown} />
        <Timer
          color="black"
          time={this.state.black}
          countdown={this.state.countdown} />
      </ul>
    );
  }
}

const Timer = props => {
  const {time, color, countdown} = props;
  const min = Math.floor(time / 60);
  const sec = time % 60;
  const timeLeft = `${min}:${sec < 10 ? '0' + sec : sec}`;

  return (
    <li className={color + (color === countdown ? ' ticking' : '')}>
      {timeLeft}
    </li>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Clock);
