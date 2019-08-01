import diff from 'deep-diff';

export const ItemTypes = { PIECE: 'piece' };
export const COLUMNS = '0123456789'.split('');
export const ROWS = 10;
const START_FEN = 'W:W31-50:B1-20';

export const constructPositionAttributes = (currentPosition, position) => {
	const difference = diff(currentPosition, position);
	const squaresAffected = difference.length;
	const sourceSquare =
		difference && difference[1] && difference && difference[1].kind === 'D'
			? difference[1].path && difference[1].path[0]
			: difference[0].path && difference[0].path[0];
	const targetSquare =
		difference && difference[1] && difference && difference[1].kind === 'D'
			? difference[0] && difference[0].path && difference[0].path[0]
			: difference[1] && difference[0].path && difference[1].path[0];
	const sourcePiece =
		difference && difference[1] && difference && difference[1].kind === 'D'
			? difference[1] && difference[1].lhs
			: difference[1] && difference[1].rhs;
	return { sourceSquare, targetSquare, sourcePiece, squaresAffected };
};

function isString(s) {
	return typeof s === 'string';
}

export function deepCopy(thing) {
	return JSON.parse(JSON.stringify(thing));
}

export function fenToObj(fen) {
	if (validFen(fen) !== true) {
		return false;
	}

	// cut off any move, castling, etc info from the end
	// we're only interested in position information
	fen = fen.replace(/\s+/g, '');
	fen = fen.replace(/\..*$/, '');

	var rows = fen.split(':');
	var position = [];

	var currentRow = 10;
	// var colIndex = 0

	for (var i = 1; i <= 2; i++) {
		var color = rows[i].substr(0, 1);
		var row = rows[i].substr(1);
		var j;
		if (row.indexOf('-') !== -1) {
			row = row.split('-');
			for (j = parseInt(row[0], 10); j <= parseInt(row[1], 10); j++) {
				position[j] = color.toLowerCase();
			}
		} else {
			row = row.split(',');
			for (j = 0; j < row.length; j++) {
				if (row[j].substr(0, 1) === 'K') {
					position[row[j].substr(1)] = color && color.toUpperCase();
				} else {
					position[row[j]] = color.toLowerCase();
				}
			}
		}
		currentRow--;
	}

	return position;
}

function expandFenEmptySquares(fen) {
	return fen
		.replace(/8/g, '11111111')
		.replace(/7/g, '1111111')
		.replace(/6/g, '111111')
		.replace(/5/g, '11111')
		.replace(/4/g, '1111')
		.replace(/3/g, '111')
		.replace(/2/g, '11');
}

export function validFen(fen) {
	if (typeof fen !== 'string') return false;
	if (fen === START_FEN) return true;
	var FENPattern = /^(W|B):(W|B)((?:K?\d*)(?:,K?\d+)*?)(?::(W|B)((?:K?\d*)(?:,K?\d+)*?))?$/;
	var matches = FENPattern.exec(fen);
	if (matches != null) {
		return true;
	}
	return false;
}

// convert FEN piece code to bP, wK, etc
function fenToPieceCode(piece) {
	console.log(piece);
	// black piece
	if (piece.toLowerCase() === piece) {
		return 'b' + piece.toUpperCase();
	}

	// white piece
	return 'w' + piece.toUpperCase();
}

function validSquare(square) {
	if (square && square.substr(0, 1) === 'K') {
		square = square.substr(1);
	}
	square = parseInt(square, 10);
	return square >= 0 && square < 51;
}

function validPieceCode(code) {
	if (typeof code !== 'string') return false;
	return code.search(/^[bwBW]$/) !== -1;
}

export function validPositionObject(pos) {
	if (typeof pos !== 'object') return false;
	// pos = fenToObj(pos)
	for (var i in pos) {
		if (pos.hasOwnProperty(i) !== true) continue;
		if (pos[i] == null) {
			continue;
		}
		if (validSquare(i) !== true || validPieceCode(pos[i]) !== true) {
			// TODO console.trace('flsed in valid check', i,pos[i], validSquare(i), validPieceCode(pos[i]))
			return false;
		}
	}
	return true;
}

function squeezeFenEmptySquares(fen) {
	return fen
		.replace(/11111111/g, '8')
		.replace(/1111111/g, '7')
		.replace(/111111/g, '6')
		.replace(/11111/g, '5')
		.replace(/1111/g, '4')
		.replace(/111/g, '3')
		.replace(/11/g, '2');
}

// convert bP, wK, etc code to FEN structure
function pieceCodeToFen(piece) {
	let pieceCodeLetters = piece.split('');

	// white piece
	if (pieceCodeLetters[0] === 'w') {
		return pieceCodeLetters[1].toUpperCase();
	}

	// black piece
	return pieceCodeLetters[1].toLowerCase();
}

// position object to FEN string
// returns false if the obj is not a valid position object
function objToFen(obj) {
	if (validPositionObject(obj) !== true) {
		return false;
	}
	var black = [];
	var white = [];
	for (var i = 0; i < obj.length; i++) {
		switch (obj[i]) {
			case 'w':
				white.push(i);
				break;
			case 'W':
				white.push('K' + i);
				break;
			case 'b':
				black.push(i);
				break;
			case 'B':
				black.push('K' + i);
				break;
			default:
				break;
		}
	}
	return 'w'.toUpperCase() + ':W' + white.join(',') + ':B' + black.join(',');

	// return fen
}
