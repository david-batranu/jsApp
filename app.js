
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    redis = require('redis');

var app = express();
var db;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.locals.pretty = true;
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('production', function(){
  // redis connection
  dbConfig = JSON.parse(process.env.VCAP_SERVICES);
  dbCredentials = dbConfig['redis-2.2'][0].credentials;
  redisClient = redis.createClient(dbCredentials.port, dbCredentials.host);
  redisClient.auth(dbCredentials.password, function(){
    db = redisClient;
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
  db = redis.createClient();
});

app.get('/', routes.index);
app.get('/view/:id', routes.view);
app.get('/edit/:id', routes.edit);
app.get('/users', function(req, res){
  user.list(req, res, db);
});

app.get('/addsong', function(req, res){
  routes.addsong(req, res, db);
});

app.get('/getsongs', function(req, res){
  routes.getsongs(req, res, db);
});

app.get('/getsong/:id', function(req, res){
  routes.getsong(req, res, db);
});

app.get('/delsong', function(req, res){
  routes.delsong(req, res, db);
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
