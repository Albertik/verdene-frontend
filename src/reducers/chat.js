import { List, Map } from 'immutable';
import { SUBMIT_MESSAGE, TOGGLE_VISIBILITY } from '../constants/chatActionTypes';

var _messages = List();
var _unseenCount = 0;
var _isChatHidden = false;

function toggleVisibility() {
	_isChatHidden = !_isChatHidden;
	_unseenCount = 0;
}

function submitMessage(message, className, received) {
	_messages = _messages.push(
		Map({
			message: message,
			className: className
		})
	);

	if (received && _isChatHidden) {
		_unseenCount += 1;
	}
}

export default (
	state = {
		messages: _messages,
		unseenCount: _unseenCount,
		isChatHidden: _isChatHidden
	},
	action
) => {
	switch (action.type) {
		case SUBMIT_MESSAGE:
			let { payload } = action;
			submitMessage(payload.message, payload.className, payload.received);
			return {
				...state,
				messages: _messages,
				unseenCount: _unseenCount
			};
		case TOGGLE_VISIBILITY:
			toggleVisibility();
			return {
				...state,
				unseenCount: _unseenCount,
				isChatHidden: _isChatHidden
			};

		default:
			return state;
	}
};
