import React from 'react';

import io from '../../io';
import GameInterface from './GameInterface';
import '../../assets/styles/main.scss';
import AlertModal from '../Modals/AlertModal';

let params = window.location.pathname.replace('/play/', '').split('/');
params[1] = parseInt(params[1], 10);
params[2] = parseInt(params[2], 10);

export const Play = () => {
	if (params[0] && params[1]) {
		return <GameInterface io={io} params={params} />;
	} else {
		return <AlertModal heading='Wrong parameters for a game!'/>;
	}
};
