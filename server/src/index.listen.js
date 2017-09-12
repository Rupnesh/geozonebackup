const pushService = require('./services/PushNotificationService');
const { api } = require('./config');
const { User } = require('./endpoints/v1/user/controller');


this.roomName = conversation => {
  return `conversation${conversation.id}`;
};

this.sendNotification = (io, socket, data) => {
  const { msg, conversation } = data;
  const roomName = that.roomName(conversation);
  const socketIds = io.sockets.adapter.rooms[roomName];
  
  let keys = [];
  if (socketIds) {
    for (const k in socketIds.sockets) {
      if (k !== socket.id) {
        keys.push(k);
      }
    }
  }
  
  if (socketIds && keys.length > 0) {
    socket.broadcast.to(roomName).emit('chat_message', data);
  } else {
    const { user } = msg;
    const participantsEmails = (conversation.allParticipants).map(p => p.email);
    User
      .findByEmails(participantsEmails)
      .then((res) => {
        const registrationIds = res.filter(u => u.dataValues.email !== user.email).map(u => u.dataValues.pushNotificationToken);
        const pn = {
          contentAvailable: true,
          custom: {
            info: data,
            type: 'message'
          }
        };
        pushService.send(registrationIds, pn, (err, result) => {
          if (err) {
            // console.log(err);
          } else {
            // console.log(result[0].message);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

const that = this;

module.exports = function listen(app) {
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  
  server.listen(api.port, function started() {
    const address = this.address();
    
    const host = address.address !== '::' ? address.address : 'localhost';
    const port = address.port;
    console.log('App listening at http://%s:%s', host, port);
    console.log('Swagger Doc started at at http://%s:%s/docs', host, port);
  });
  
  app.get('/', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
  });
  
  const connectedUsersRoom = 'connectedUsers';
  const connectedUsers = {};
  
  io.use(function(socket, next) {
    // console.log("Query: ", socket.handshake.query);
    // return the result of next() to accept the connection.
    // if (socket.handshake.query.userId !== null) {
    //   return next();
    // }
    // call next() with an Error if you need to reject the connection.
    // next(new Error('Authentication error'));
    next();
  });
  
  io.on('connection', (socket) => {
      
      let userId = socket.handshake.query['userId'];
      
      connectedUsers[userId] = socket.id;
      io.to(connectedUsersRoom).emit('connectedUser', userId);
      socket.emit('connected', Object.keys(connectedUsers));
      socket.join(connectedUsersRoom);
      
      socket.on('disconnectMe', () => {
        delete connectedUsers[userId];
        io.to(connectedUsersRoom).emit('disconnectedUser', userId);
        socket.leave(connectedUsersRoom);
        
        const rooms = io.nsps['/'].adapter.rooms;
        for (let room in rooms) {
          if (room !== connectedUsersRoom) {
            io.to(room).emit('leave', socket.id);
            socket.leave(room);
          }
        }
        socket.disconnect(0);
      });
      
      socket.on('leave_conversation', (conversation) => {
        const roomName = that.roomName(conversation);
        socket.leave(roomName);
      });
      
      socket.on('join_conversation', (conversation) => {
        const roomName = that.roomName(conversation);
        socket.join(roomName);
      });
      
      socket.on('chat_message', (data) => {
        const { msg } = data;
        
        if (msg.type === 'audio') {
          that.sendNotification(io, socket, data);
        }
        else {
          Messages.add(msg)
            .then((res) => {
              const { id, status } = res.dataValues;
              data.msg.id = id;
              data.msg.uniqueId = id;
              data.msg.status = status;
              
              socket.emit('chat_message_success', data);
              that.sendNotification(io, socket, data);
            })
            .catch(err => {
              console.log(err);
              socket.emit('chat_message_error', data.msg);
            });
        }
      });
      
      socket.on('update_status', (obj) => {
        User
          .update(obj.id, { status: obj.status })
          .then(() => {
            Contacts
              .update(obj.id, { status: obj.status })
              .then((res) => {
                io.to(connectedUsersRoom).emit('update_status', { email: res.email, status: res.status });
              })
          })
      });
      
      socket.on('update_statusMessage', (obj) => {
        User
          .update(obj.id, { statusMessage: obj.statusMessage })
          .then(() => {
            Contacts
              .update(obj.id, { statusMessage: obj.statusMessage })
              .then((res) => {
                io.to(connectedUsersRoom).emit('update_statusMessage', {
                  email: res.email,
                  statusMessage: res.statusMessage
                });
              })
          })
      });
      
      socket.on('is_typing', (data) => {
        const roomName = that.roomName(data.conversation);
        socket.broadcast.to(roomName).emit('is_typing', data.user);
      });
      
      socket.on('stop_typing', (data) => {
        const roomName = that.roomName(data.conversation);
        socket.broadcast.to(roomName).emit('stop_typing', data.user);
      });
      
      socket.on('seen', (data) => {
        const { conversation } = data;
        const roomName = that.roomName(conversation);
        Messages.markAsSeen(conversation.id, data.userEmail)
          .then(() => {
            socket.broadcast.to(roomName).emit('seen', data);
          });
      });
      
      socket.on('initiateCall', (data) => {
        data.from = socket.id;
        const calledUserId = data.to;
        const calledSocketId = connectedUsers[calledUserId];
        const to = io.sockets.connected[calledSocketId];
        if (calledUserId && to) { // user is inside app
          to.emit('callRequest', data);
          socket.emit('callRequestSent', data);
        } else {
          User
            .findByEmail(calledUserId)
            .then((res) => {
              const registrationIds = res.pushNotificationToken;
              const notification = {
                contentAvailable: true,
                custom: {
                  info: data,
                  type: 'call',
                },
              };
              
              pushService.send(registrationIds, notification, (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  const res = result[0];
                  console.log(res.message[0]);
                  if (res.message[0] && !res.message[0].error && res.failure === 0) {
                    socket.emit('callRequestSent', data);
                  }
                }
              });
            });
        }
      });
      
      socket.on('callResponse', (data) => {
        const callerSocket = io.sockets.connected[data.callerSocketId];
        data.from = socket.id;
        if (data.accepted) {
          callerSocket.join(data.roomId);
          socket.join(data.roomId);
        }
        callerSocket && callerSocket.emit('callResponse', data);
      });
      
      socket.on('endCall', (data) => {
        const socketId = connectedUsers[data.userId];
        const to = io.sockets.connected[socketId];
        data.from = socket.id;
        to && to.emit('callEnded', data);
      });
      
      socket.on('offer', (data) => {
        data.from = socket.id;
        const to = io.sockets.connected[data.to];
        to && to.emit('offer', data);
      });
      
      socket.on('answer', (data) => {
        data.from = socket.id;
        const to = io.sockets.connected[data.to];
        to.emit('answer', data);
      });
      
      socket.on('candidate', (data) => {
        data.from = socket.id;
        const to = io.sockets.connected[data.to];
        to && to.emit('candidate', data);
      });
    }
  )
  ;
}
;
