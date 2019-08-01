import React from 'react';

import Draughtsboard from '../Draughtsboard';
import elvis from '../img/elvis.png';
import lebronJames from '../img/kingJames.png';
import { roughSquare } from '../customRough';

/* eslint react/display-name: 0 */
/* eslint react/prop-types: 0 */
export default function CustomizedBoard() {
	return (
		<Draughtsboard
			id="standard"
			orientation="black"
			calcWidth={({ screenWidth }) => (screenWidth < 500 ? 350 : 480)}
			roughSquare={roughSquare}
			position="start"
			boardStyle={{
				borderRadius: '5px',
				boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
			}}
			dropOffBoard="trash"
			pieces={{
				w: ({ squareWidth, isDragging }) => (
					<img
						style={{
							width: isDragging ? squareWidth * 1.75 : squareWidth,
							height: isDragging ? squareWidth * 1.75 : squareWidth
						}}
						src={elvis}
						alt={'elvis'}
					/>
				),
				b: ({ squareWidth, isDragging }) => (
					<img
						style={{
							width: isDragging ? squareWidth * 1.75 : squareWidth,
							height: isDragging ? squareWidth * 1.75 : squareWidth
						}}
						src={lebronJames}
						alt={'lebron james'}
					/>
				)
			}}
			sparePieces={true}
		/>
	);
}
