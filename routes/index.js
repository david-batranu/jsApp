
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'jsApp!' });
};

exports.view = function(req, res){
    res.render('view', {
        title: req.params.id,
        path: '/files/' + req.params.id
    });
};

exports.edit = function(req, res){
    res.render('edit', {
        title: req.params.id,
        path: '/files/' + req.params.id
    });
};