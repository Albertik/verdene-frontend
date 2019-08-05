import React from 'react';
import PropTypes from 'prop-types';

import Clock from './Clock';

const GameHeader = props => {
	const { io, params } = props;

	return (
		<header className="clearfix">
			<Clock io={io} params={params} />
		</header>
	);
};

GameHeader.propTypes = {
	io: PropTypes.object.isRequired,
	params: PropTypes.array.isRequired
};

export default GameHeader;
