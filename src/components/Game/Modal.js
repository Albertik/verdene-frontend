import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class Modal extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object.isRequired
	};

	_onKeydown(e) {
		const type = this.props.data.get('type');
		const callbacks = this.props.data.get('callbacks');

		if (type === 'info') {
			if (e.which === 13 || e.which === 27) {
				callbacks.hide();
			}
		} else if (type === 'offer') {
			if (e.which === 13) {
				callbacks.accept();
			} else if (e.which === 27) {
				callbacks.decline();
			}
		}
	}

	_hideModal() {
		this.props.data.get('callbacks').hide();
	}

	constructor(props) {
		super(props);
		this._onKeydown = this._onKeydown.bind(this);
		this._hideModal = this._hideModal.bind(this);
	}

	componentDidUpdate() {
		const isOpen = this.props.data.get('open');

		if (isOpen) document.addEventListener('keydown', this._onKeydown);
		else document.removeEventListener('keydown', this._onKeydown);
	}

	render() {
		const data = this.props.data;
		const type = data.get('type');
		const callbacks = data.get('callbacks');

		return (
			<div
				className={cx({
					'modal-mask': true,
					hidden: !data.get('open')
				})}
				onClick={this._hideModal}
			>
				<p>
					<strong>Esc: </strong>
					<span>{type === 'info' ? 'OK' : 'Decline'}</span>
					<br />
					<strong>Enter: </strong>
					<span>{type === 'info' ? 'OK' : 'Accept'}</span>
				</p>

				<div className="modal" onClick={e => e.stopPropagation()}>
					<p>{data.get('message')}</p>

					{type === 'info' ? (
						<a className="btn ok" onClick={callbacks.hide}>
							OK
						</a>
					) : (
						[
							<a key="a" className="btn" style={{ left: '4em' }} onClick={callbacks.accept}>
								Accept
							</a>,
							<a key="b" className="btn btn--red" style={{ right: '4em' }} onClick={callbacks.decline}>
								Decline
							</a>
						]
					)}
				</div>
			</div>
		);
	}
}

export default Modal;
