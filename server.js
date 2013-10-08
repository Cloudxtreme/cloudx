var connect = require('connect'),
    http = require('http'),
    directory = 'D:\\Users\\косуха\\Documents\\Aptana Studio 3 Workspace\\CloudxOffline\\serve';

connect()
    .use(connect.static(directory))
    .listen(80);

console.log('Listening on port 80.');