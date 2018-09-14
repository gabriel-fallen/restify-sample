var restify = require('restify');

var server = restify.createServer();

server.get('/*', restify.plugins.serveStatic({
  directory: './build',
  default: 'index.html'
}));

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
