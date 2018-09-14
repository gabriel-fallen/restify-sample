var os = require('os');
var restify = require('restify');

var server = restify.createServer();

var shoppingCart = {
  goods: ["Apple pie", "Bananas", "Orange juice"],
  totalPrice: 40
};

server.use(restify.plugins.bodyParser({
  maxBodySize: 0,
  mapParams: true,
  mapFiles: false,
  overrideParams: false,
  keepExtensions: false,
  uploadDir: os.tmpdir(),
  multiples: true,
  hash: 'sha1',
  rejectUnknown: true,
  requestBodyOnGet: false,
  reviver: undefined,
  maxFieldsSize: 2 * 1024 * 1024
}));

server.get('/*', restify.plugins.serveStatic({
  directory: './build',
  default: 'index.html'
}));

server.get('/cart', function(req, res, next) {
  res.send(shoppingCart);
  return next();
});

server.post('/cart/add', function(req, res, next) {
  shoppingCart.goods.push(req.body.name);
  shoppingCart.totalPrice += req.body.price;
  res.send(shoppingCart);
  return next();
});

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
