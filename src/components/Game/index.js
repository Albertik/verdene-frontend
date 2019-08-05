import React from 'react';
import PropTypes from 'prop-types';
import CreateGameForm from './CreateGameForm';
import '../../assets/styles/main.scss';

class Index extends React.Component {
	static propTypes = {
		io: PropTypes.object.isRequired
	};

	getInitialState() {
		return {
			link: '',
			hasExpired: false,
			time: '30',
			inc: '0'
		};
	}

	constructor(props) {
		super(props);
		this.state = this.getInitialState();
		this._onChangeForm = this._onChangeForm.bind(this);
		this._createGame = this._createGame.bind(this);
	}

	_onChangeForm(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	_createGame(e) {
		e.preventDefault();

		const { time, inc } = this.state;
		const isInvalid = [time, inc].some(val => {
			val = parseInt(val, 10);
			return isNaN(val) || val < 0 || val > 50;
		});

		if (isInvalid) {
			// fallback for old browsers
			return window.alert('Form is invalid. Enter numbers between 0 and 50.');
		} else {
			this.props.io.emit('start');
		}
	}

	componentDidMount() {
		const io = this.props.io;

		io.on('created', data => {
			const { time, inc } = this.state;
			const loc = window.location;

			const origin = loc.origin || `${loc.protocol}//${loc.hostname}` + (loc.port ? ':' + loc.port : '');

			this.setState({
				link: `${origin}/play/${data.token}/${time}/${inc}`,
				hasExpired: false
			});
		});
		io.on('ready', () => {
			window.location = this.state.link;
		});
		io.on('token-expired', () => this.setState({ hasExpired: true }));
	}

	render() {
		return (
			<div id="container-wrapper">
				<div id="game-container">
					<img src={require('../../assets/images/UG352 - Giant Draughts Pieces 2.jpg')} width="122" height="122" className="knight" />
					<h1>Draughts Game!</h1>

					<div id="create-game">
						<CreateGameForm
							link={this.state.link}
							time={this.state.time}
							inc={this.state.inc}
							onChangeForm={this._onChangeForm}
							createGame={this._createGame}
						/>

						<p id="game-status">
							{this.state.hasExpired
								? 'Game link has expired, generate a new one'
								: this.state.link
								? 'Waiting for opponent to connect'
								: null}
						</p>
					</div>

					<p>
						Click the button to create a game. Send the link to your friend. Once the link is opened your friend‘s browser, game should
						begin shortly. Colors are picked randomly by computer.
					</p>
				</div>
			</div>
		);
	}
}

export default Index;
