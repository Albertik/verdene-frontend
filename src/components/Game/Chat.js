import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TOGGLE_VISIBILITY, SUBMIT_MESSAGE } from '../../constants/chatActionTypes';

const mapStateToProps = state => ({
	...state.chat
});

const mapDispatchToProps = dispatch => ({
	toggleVisibility: () => dispatch({ type: TOGGLE_VISIBILITY }),
	submitMessage: payload => dispatch({ type: SUBMIT_MESSAGE, payload })
});

class Chat extends React.PureComponent {
	static propTypes = {
		io: PropTypes.object.isRequired,
		token: PropTypes.string.isRequired,
		color: PropTypes.oneOf(['white', 'black']).isRequired,
		soundsEnabled: PropTypes.bool.isRequired,
		isOpponentAvailable: PropTypes.bool.isRequired,
		openModal: PropTypes.func.isRequired
	}

	_submitMessage(e) {
		e.preventDefault();
		const { io, token, color, isOpponentAvailable } = this.props;
		const message = this.state.message;

		if (!isOpponentAvailable) {
			this.refs.message.getDOMNode().blur();
			this.props.openModal('info', 'Sorry, your opponent is not connected. ' + 'You can‘t send messages.');
			return;
		}

		this.props.submitMessage({
			message: message,
			className: color + ' left',
			received: false
		})
		this.setState({ message: '' });

		io.emit('send-message', {
			message: message,
			color: color,
			token: token
		});
	}

	_onChangeMessage(e) {
	  this.setState({ message: e.target.value });
	}

	_scrollChat() {
		const chatNode = this.refs.chat.getDOMNode();
		chatNode.scrollTop = chatNode.scrollHeight;
		console.log('scrolling');
	}
	// _maybePlaySound() {
	// 	if (this.props.soundsEnabled) {
	// 		this.refs.msgSnd.getDOMNode().play();
	// 	}
	// }

	constructor(props) {
		super(props);
		this.state = {
			isChatHidden: this.props.isChatHidden,
			messages: this.props.messages,
			message: ''
		};
		this._submitMessage = this._submitMessage.bind(this);
		this._onChangeMessage = this._onChangeMessage.bind(this);
		this._scrollChat = this._scrollChat.bind(this);
	}

	componentDidMount() {
		let {props} = this;
		props.io.on('receive-message', data => {
			props.submitMessage({
				message: data.message,
				className: data.color + ' left',
				received: true
			})
			// this._maybePlaySound();
		});

		if (window.innerWidth > 1399) this.props.toggleVisibility();
	}
	render() {
		return (
			<div id="chat-wrapper" className={this.props.isChatHidden ? 'hidden' : null}>
				<h4>Chat</h4>
				<a className="close" onClick={this.props.toggleVisibility}>
					x
				</a>

				<audio preload="auto" ref="msgSnd">
					<source src="/snd/message.mp3" />
				</audio>

				<ul id="chat-list" ref="chat">
					{this.props.messages
						.map((message, i) => (
							<li key={i} className={message.get('className')}>
								{message.get('message')}
							</li>
						))
						.toArray()}
				</ul>

				<span>Write your message:</span>

				<form id="chat-form" onSubmit={this._submitMessage}>
					<input
						type="text"
						ref="message"
						className={this.props.color}
						required
						value={this.state.message}
						onChange={this._onChangeMessage}
					/>
				</form>
			</div>
		);
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
