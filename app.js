
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


var passport = require('passport'),
  GoogleStrategy = require('passport-google').Strategy;



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.locals.pretty = true;
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.favicon());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.logger('dev'));
});

app.configure('production', function(){
  // redis connection
  dbConfig = JSON.parse(process.env.VCAP_SERVICES);
  dbCredentials = dbConfig['redis-2.2'][0].credentials;
  redisClient = redis.createClient(dbCredentials.port, dbCredentials.host);
  redisClient.auth(dbCredentials.password, function(){
    db = redisClient;
  });

  passport.use(new GoogleStrategy({
      returnURL: 'http://jsapp.seekahead.eu/auth/google/return',
      realm: 'http://jsapp.seekahead.eu/'
    },
    function(identifier, profile, done) {
      console.log(identifier);
      console.log(profile);
      console.log(done);
    }
  ));
});

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  db = redis.createClient();

  passport.use(new GoogleStrategy({
      returnURL: 'http://localhost:3000/auth/google/return',
      realm: 'http://localhost:3000/'
    },
    function(identifier, profile, done) {
      db.get('masteruser', function(err, reply){
        var email = profile.emails[0].value;
        if(email == reply){
          done(null, email);
        }else {
          done(null, false);
        }
      });
    }
  ));
});

app.get('/', routes.index);
app.get('/view/:id', function(req, res){
  routes.view(req, res, db);
});
app.get('/edit/:id', ensureAuthenticated, function(req, res){
  if(req.isAuthenticated()){
    routes.edit(req, res, db);
  }
});
app.get('/users', function(req, res){
  user.list(req, res, db);
});

app.get('/addsong', ensureAuthenticated, function(req, res){
  if(req.isAuthenticated()){
    routes.addsong(req, res, db);
  }
});

app.get('/getsongs', function(req, res){
  routes.getsongs(req, res, db);
});

app.get('/getsong/:id', function(req, res){
  routes.getsong(req, res, db);
});

app.get('/editsong', ensureAuthenticated, function(req, res){
  if(req.isAuthenticated()){
    routes.editsong(req, res, db);
  }
});

app.get('/delsong', ensureAuthenticated, function(req, res){
  if(req.isAuthenticated()){
    routes.delsong(req, res, db);
  }
});


// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return',
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

