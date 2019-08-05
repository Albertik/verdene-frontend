import io from 'socket.io-client';

const socket = io('http://albert-getloyalti.ngrok.io');
export default socket;
// socket.on('connect', data => {
// 	console.log('connected!', data);
// });
// socket.on('events', data => {
// 	console.log(data);
// });
// socket.on('disconnect', data => {
// 	console.log('disconnected!', data);
// });
// socket.on('created', data => {
// 	console.log('created', data);
// 	socket.emit('join', { token: data.token });
// 	socket.emit('join', { token: data.token });
// 	socket.emit('join', { token: data.token });
// });
// socket.on('joined', data => {
// 	console.log('joined', data);
// });
// socket.on('token-invalid', data => {
// 	console.log('token-invalid', data);
// });
// socket.on('full', data => {
// 	console.log('full', data);
// });
// socket.emit('events', { name: 'Nest' });
// socket.emit('start', { name: 'Nest' });
