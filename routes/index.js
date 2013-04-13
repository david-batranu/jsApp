
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

var db_getSong = function(id, db, callback){
  var songIdKEY = 'song:' + id + ':name';
  var songFilenameKEY = 'song:' + id + ':filename';
  var data = {};
  data.id = id;
  db.get(songIdKEY, function(err, reply){
    data.name = reply;
  });
  db.get(songFilenameKEY, function(err, reply){
    data.filename = reply;
    callback(data);
  });
};

var db_delSong = function(id, db, callback){
  var songIdKEY = 'song:' + id + ':name';
  db.get(songIdKEY, function(err, reply){
    var songNameKEY = 'song:' + reply +':id';
    db.srem('songs', songIdKEY);
    db.del(songIdKEY);
    db.del(songNameKEY);
    callback(songIdKEY);
  });
};

exports.index = function(req, res){
  res.render('index', { title: 'jsApp!' });
};

exports.addsong = function(req, res, db){
  db.incr('song:id', function(err, reply){
    var newSongId = reply;
    var songIdKEY = 'song:' + newSongId + ':name';
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
  var songIdKEY = 'song:' + songId + ':name';
  var songFilenameKEY = 'song:' + songId + ':filename';
  db.set(songIdKEY, songTitle);
  db.set(songFilenameKEY, songFilename);
  res.send('200');
};

exports.delsong = function(req, res, db){
  var songId = req.query.id;
  db_delSong(songId, db, function(songIdKEY){
    res.send(songIdKEY);
  });
};

exports.view = function(req, res){
    res.render('view', {
        title: req.params.id,
        path: '/files/' + req.params.id,
        encoding: getEncoding(req.params.id)
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
