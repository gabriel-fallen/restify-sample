const os = require('os');
const fs = require('fs');
const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer();

const cartFile = "cart.json";
let shoppingCart = JSON.parse(fs.readFileSync(cartFile));

function saveCart() {
  return new Promise((resolve, reject) => {
    fs.writeFile(cartFile, JSON.stringify(shoppingCart), function(err) {
      if (err) {
        return reject(err);
      }
      return resolve(shoppingCart);
    });
  });
}


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

server.get('/cart', (req, res, next) => {
  res.send(shoppingCart);
  return next();
});

server.post('/cart/add', (req, res, next) => {
  shoppingCart.goods.push(req.body.name);
  shoppingCart.totalPrice += req.body.price;
  saveCart().then((data) => {
    res.send(data);
    return next();
  }).catch((err) => {
    var httpErr = new errs.InternalServerError(err);
    return next(httpErr);
  });
});

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
