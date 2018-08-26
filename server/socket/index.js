let socketEvents = (io) =>{
	io.sockets.on('connection', (socket) =>{
		console.log('sockets connected');

		socket.on('roomentered' , (data) => {
			socket.room = data.room._id;
			socket.join(socket.room);
			socket.user_name = data.author;
			socket.emit('updateroom' , 'SERVER' , 'Вы присоединились к ' + data.room.name)	// Отправление запроса на frontend / сообщение будет транслироваться только вам
			socket.broadcast.to(socket.room).emit('updateroom' , 'SERVER' , 'Пользователь ' + data.author + 'присоединился к беседе') // Всем кроме себя
		});

		socket.on('changeroom' , (data) => {
			socket.broadcast.to(socket.room).emit('updateroom' , 'SERVER' , 'Пользователь ' + socket.user_name + ' покинул беседу')
			socket.leave(socket.room) // out room
			socket.room = data.room._id; // clear room
			socket.join(socket.room);
			socket.emit('updateroom' , 'SERVER' , 'Вы присоединились к ' + data.room.name);	// Отправление запроса на frontend / сообщение будет транслироваться только вам
			socket.broadcast.to(socket.room).emit('updateroom' , 'SERVER' , 'Пользователь ' + socket.user_name + 'присоединился к беседе'); // Всем кроме себя

		});

		socket.on('sendtext' , (data) => {
			socket.emit('updateroom' , data.author , data.text)
			socket.broadcast.to(socket.room).emit('updateroom' , data.author , data.text)
		})

		socket.on('getmessages' , (data) => {
			Message.find({room: room_id}).exec((err, messages) => {
				socket.emit('' , messages)
			})
		})

	});
}

module.exports = socketEvents;