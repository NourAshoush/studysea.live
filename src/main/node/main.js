// see https://socket.io/get-started/chat

const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT || 3000;

//upon WebSocket connection: io refers to the set of all connections
io.on('connection', socket => {
  console.log('a user connected');
  //socket.broadcast.emit('chat message', JSON.stringify({ type: 'status', message: 'A user connected' }));

  //upon disconnect event for any one socket connection
  socket.on('disconnect', () => {
    console.log('a user disconnected');
    //io.emit('chat message', JSON.stringify({ type: 'status', message: 'A user disconnected' }));
  });

  //upon incoming chat message event for any one socket connection
  socket.on('chat message', msg => {
    //msg will be an JSON object literal so it can transport multiple attributes
    //let myObj = JSON.parse(msg);
    console.log('message: ' + msg.message);

    //emit message to all socket connections excl. the sender
    //socket.broadcast.emit('chat message', JSON.stringify(myObj));//
    socket.to(msg.room).emit('chat message', msg);
  });

  socket.on('list rooms', msg => {
    // if client sends a message consisting of string 'list.room', server receives this as a list rooms event
    let element;
    // iterate through Set of socket's rooms, and for each one sends it as a chat message to the client's chat box
    for (element of socket.rooms.values()) {
      msg.message = element.toString();
      socket.emit('chat message', msg);
    }
    //msg.message = 'Hello World!';
    //socket.emit('chat message', msg);
  });

  socket.on('update room', room => {
    try {
      let arrayRooms = socket.rooms.values();
      for (let i = 1; i < socket.rooms.values().length; i++) {
        socket.leave(arrayRooms[i].toString());
      }

      socket.join(room);
      //sends status message to socket's chat box that they have joined the given room
      //socket.to(socket.id).emit('chat message', { type: 'status', message: `You have joined room: ${room}` });
    } catch (e) {
      console.log('[error]: ' + e);
    }
  });

  /*socket.on('new user', payload => {
    socket.to(payload.room).emit(payload);
  });*/
});

//listen to server on the given port
httpServer.listen(port, () => {
  //confirmation message
  console.log(`listening on *:{port}`);
});
