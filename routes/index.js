
/*
 * GET home page.
 */

var getEncoding = function(filename){
    var extension = filename.split('.').slice(-1)[0];
    if(extension == 'mp3') return 'audio/mp3';
    if(extension == 'ogg') return 'audio/ogg';
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
  var songIdKEY = 'song:' + songId + ':name';
  db.get(songIdKEY, function(err, reply){
    res.send(reply);
  });
};

exports.delsong = function(req, res, db){
  var songId = req.query.id;
  var songIdKEY = 'song:' + songId + ':name';
  db.get(songIdKEY, function(err, reply){
    var songNameKEY = 'song:' + reply +':id';
    db.srem('songs', songIdKEY);
    db.del(songIdKEY);
    db.del(songNameKEY);
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

exports.edit = function(req, res){
    res.render('edit', {
        title: req.params.id,
        path: '/files/' + req.params.id,
        encoding: getEncoding(req.params.id)
    });
};
