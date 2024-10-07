const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const setupSocketIO = (server) => {
  const io = socketIo(server);

  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error('Authentication error'));
    }
  }).on('connection', (socket) => {
    console.log('User connected:', socket.decoded.userId);

    socket.on('updateLocation', (data) => {
      socket.broadcast.emit('locationUpdate', {
        userId: socket.decoded.userId,
        location: data.location
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.decoded.userId);
      socket.broadcast.emit('userDisconnected', socket.decoded.userId);
    });
  });

  return io;
};

module.exports = setupSocketIO;