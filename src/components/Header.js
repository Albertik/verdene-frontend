import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutView = props => {
	if (!props.currentUser) {
		return (
			<ul className={`nav navbar-nav pull-xs-right${props.responsive ? ' responsive' : ''}`}>
				<li className="nav-item">
					<Link to="/" className="nav-link">
						Home
					</Link>
				</li>

				<li className="nav-item">
					<Link to="/login" className="nav-link">
						Sign in
					</Link>
				</li>

				<li className="nav-item">
					<Link to="/register" className="nav-link">
						Sign up
					</Link>
				</li>
				<li className="icon" onClick={props.onClickNavIcon}>
					<i class="ionicons ion-navicon-round" />
				</li>
			</ul>
		);
	}
	return null;
};

const LoggedInView = props => {
	if (props.currentUser) {
		return (
			<ul className={`nav navbar-nav pull-xs-right${props.responsive ? ' responsive' : ''}`}>
				<li className="nav-item">
					<Link to="/" className="nav-link">
						Home
					</Link>
				</li>

				<li className="nav-item">
					<Link to="/editor" className="nav-link">
						<i className="ion-compose" />
						&nbsp;New Post
					</Link>
				</li>

				<li className="nav-item">
					<Link to="/settings" className="nav-link">
						<i className="ion-gear-a" />
						&nbsp;Settings
					</Link>
				</li>

				<li className="nav-item">
					<Link to={`/@${props.currentUser.username}`} className="nav-link">
						<img src={props.currentUser.image} className="user-pic" alt={props.currentUser.username} />
						{props.currentUser.username}
					</Link>
				</li>
				<li className="icon" onClick={props.onClickNavIcon}>
					<i class="ionicons ion-navicon-round" />
				</li>
			</ul>
		);
	}

	return null;
};

class Header extends React.Component {
	constructor() {
		super();
		this.state = {
			responsive: false
		};
		this.toggleResponsive = this.toggleResponsive.bind(this);
	}

	toggleResponsive() {
		this.setState({ responsive: !this.state.responsive });
	}

	render() {
		return (
			<nav className="navbar navbar-light">
				<div className="container">
					<Link to="/" className="navbar-brand">
						{this.props.appName.toLowerCase()}
					</Link>

					{!/play|game/.test(window.location.pathname) && (
						<Link className="btn btn-primary" to="/game">
							Play Game
						</Link>
					)}

					<LoggedOutView currentUser={this.props.currentUser} responsive={this.state.responsive} onClickNavIcon={this.toggleResponsive} />

					<LoggedInView currentUser={this.props.currentUser} responsive={this.state.responsive} onClickNavIcon={this.toggleResponsive} />
				</div>
			</nav>
		);
	}
}

export default Header;
