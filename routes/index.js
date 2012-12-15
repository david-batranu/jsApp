
/*
 * GET home page.
 */

var getEncoding = function(filename){
    var extension = filename.split('.').slice(-1)[0];
    if(extension == 'mp3') return 'audio/mp3'
    if(extension == 'ogg') return 'audio/ogg'
}

exports.index = function(req, res){
  res.render('index', { title: 'jsApp!' });
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