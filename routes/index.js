
/*
 * GET home page.
 */

var getEncoding = function(filename){
  if(filename){
    var extension = filename.split('.').slice(-1)[0];
    if(extension == 'mp3') return 'audio/mp3';
    if(extension == 'ogg') return 'audio/ogg';
  }
};

var getSongKEY = function(id, property){
  return 'song:' + id + ':' + property;
};

var db_getSong = function(id, db, callback){
  var songIdKEY = getSongKEY(id, 'name');
  var songFilenameKEY = getSongKEY(id, 'filename');
  var songStepsKEY = getSongKEY(id, 'steps');
  var data = {};
  data.id = id;
  db.get(songIdKEY, function(err, reply){
    data.name = reply;
  });
  db.get(songFilenameKEY, function(err, reply){
    data.filename = reply;
  });
  db.get(songStepsKEY, function(err, reply){
    data.steps = JSON.parse(reply);
    callback(data);
  });
};

var db_delSong = function(id, db, callback){
  var songIdKEY = getSongKEY(id, 'name');
  db.get(songIdKEY, function(err, reply){
    var songNameKEY = 'song:' + reply +':id';
    db.srem('songs', songIdKEY);
    db.del(songIdKEY);
    db.del(songNameKEY);
    callback(songIdKEY);
  });
};

exports.index = function(req, res){
  res.render('index', {
    title: 'jsApp!',
    isAuthenticated: req.isAuthenticated()
  });
};

exports.addsong = function(req, res, db){
  db.incr('song:id', function(err, reply){
    var newSongId = reply;
    var songIdKEY = getSongKEY(newSongId, 'name');
    var songNameKEY = 'song:' + req.query.songname +':id';
    db.set(songIdKEY, req.query.songname);
    db.set(songNameKEY, newSongId);
    db.sadd('songs', songIdKEY);
    var ret = {
      'name': req.query.songname,
      'id': newSongId
    };
    res.send(ret);
  });
};

exports.getsongs = function(req, res, db){
  db.smembers('songs', function(err, reply){
    res.send(reply);
  });
};

exports.getsong = function(req, res, db){
  var songId = req.params.id;
  db_getSong(songId, db, function(reply){
    res.send(reply);
  });
};

exports.editsong = function(req, res, db){
  var songId = req.query.id;
  var songTitle = req.query.title;
  var songFilename = req.query.filename;
  var songSteps = req.query.steps;
  var songIdKEY = getSongKEY(songId, 'name');
  var songFilenameKEY = getSongKEY(songId, 'filename');
  var songStepsKEY = getSongKEY(songId, 'steps');
  db.set(songIdKEY, songTitle);
  db.set(songFilenameKEY, songFilename);
  db.set(songStepsKEY, songSteps);
  res.send('200');
};

exports.delsong = function(req, res, db){
  var songId = req.query.id;
  db_delSong(songId, db, function(songIdKEY){
    res.send(songIdKEY);
  });
};

exports.view = function(req, res, db){
  db_getSong(req.params.id, db, function(data){
    res.render('view', {
        title: data.name,
        songid: data.id,
        songfile: data.filename,
        path: '/files/' + data.filename,
        encoding: getEncoding(data.filename)
    });
  });
};

exports.edit = function(req, res, db){
  db_getSong(req.params.id, db, function(data){
    res.render('edit', {
        title: data.name,
        songid: data.id,
        songfile: data.filename,
        path: '/files/' + data.filename,
        encoding: getEncoding(data.filename)
    });
  });
};
