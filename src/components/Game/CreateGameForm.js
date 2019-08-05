import React from 'react';
import PropTypes from 'prop-types';

class CreateGameForm extends React.PureComponent {
	static propTypes = {
		link: PropTypes.string.isRequired,
		time: PropTypes.string.isRequired,
		inc: PropTypes.string.isRequired,
		onChangeForm: PropTypes.func.isRequired,
		createGame: PropTypes.func.isRequired
	};

	constructor() {
		super();
		this.onGameLinkClick = this.onGameLinkClick.bind(this);
	}

	onGameLinkClick = e => {
		e.target.select();
		document.execCommand('copy');
	};

	render() {
		return (
			<form onSubmit={this.props.createGame}>
				<fieldset>
					<label>
						<span>Minutes per side: </span>
						<input type="number" name="time" value={this.props.time} onChange={this.props.onChangeForm} min="1" max="50" required />
					</label>
					<label style={{ paddingLeft: '2em' }}>
						<span>Increment in seconds: </span>
						<input type="number" name="inc" value={this.props.inc} onChange={this.props.onChangeForm} min="0" max="50" required />
					</label>
				</fieldset>
				<input
					id="game-link"
					type="text"
					value={this.props.link || 'Game link will be generated here.'}
					onClick={this.onGameLinkClick}
					readOnly
				/>
				<button type="submit" className="btn">
					Play
				</button>
			</form>
		);
	}
}

export default CreateGameForm;
