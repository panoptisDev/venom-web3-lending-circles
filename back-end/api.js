process.env.TZ = 'UTC'
require('dotenv').config();
const api = require.main.require('./api/');
const socket = require.main.require('./api/socket.js');
var app = api.config();

// Config Language
global._LANG = app.language;

//Running app is server instance to serve clients
//app.use('/documentation',docs.get_doc());
const SERVER = app.express.listen(process.env.NODE_PORT, () => {
 console.log('Server running on port: ', process.env.NODE_PORT);
});

//socket.io instantiation
global._SOCKET = socket.config(SERVER);
