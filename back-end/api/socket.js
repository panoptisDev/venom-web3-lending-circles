const libs = require.main.require('./libs');
const models = require.main.require('./models');
const controllers = require.main.require('./controllers');

function config(server){
  var io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  config_events(io);
  return io;
}

function config_events(io){
  io.on('connection', (socket) => {
    let socketId = socket.id;
    let token = socket.handshake.query.token;
    if(!token){
      disconnect(socketId, io);
      return null;
    }
    send_user_messages(token, socketId, io);

    // ********************** Disconnect **********************
    // socket.on('disconnect', function(data) {
    // });
    
  })

  return io;
}

async function send_user_messages(auth_hash, socket_id, io){
  let where_auth = {
    login_status: 'login',
    auth_hash: auth_hash
  }
  let theLogin = await models.queries.select_table('user_logins', where_auth);
  if(!theLogin.done || !theLogin.data){
    //disconnect socket
    disconnect(socket_id, io)
    return;
  }

  let userId = theLogin.data[0].user_id;
  let updateLogin = await models.queries.update_table('user_logins', {socket_id: socket_id}, {ulogin_id: theLogin.data[0].ulogin_id});
  if(!updateLogin.done){
    return;
  }
  
  let unsentUserMessages = await models.queries.select_table('user_messages', {user_id: userId, sent_at: null}, null, ['created_at', 'desc']);
  if(!unsentUserMessages.done || !unsentUserMessages.data){
    return;
  }
  
  let now = new Date();
  unsentUserMessages.data.forEach(userMessage => {
    let new_message = {
      sender: userMessage.sender,
      origin: userMessage.origin,
      status: userMessage.status,
      importance: userMessage.importance,
      topic: userMessage.topic,
      body: userMessage.body,
      seen: false,
      created_at: parseInt((userMessage.created_at.getTime() / 1000).toFixed(0)),
      sent_at: parseInt((now.getTime() / 1000).toFixed(0))
    }
    io.sockets.to(socket_id).emit('message', {message : new_message});
  });

  let updateUserMessages = await models.queries.update_table('user_messages', {sent_at: now.toISOString().slice(0, 24)}, {user_id: userId, sent_at: null});
  if(!updateUserMessages.done){
    return;
  }
  return;
}

async function disconnect(socket_id, io = global._SOCKET){
  try{
    let clientSocket = io.sockets.sockets.get(socket_id);
    if (typeof clientSocket != 'undefined') {
      clientSocket.disconnect();
    }
  }catch(e){
    console.log(e);
    return false;
  }
  return true;
}

module.exports = {
  config,
  disconnect
}
