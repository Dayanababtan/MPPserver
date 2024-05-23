const http = require('http');
const app1 = require('./app1');

const port = process.env.PORT || 3001;

const server = http.createServer(app1);

server.listen(port);