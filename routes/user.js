
/*
 * GET users listing.
 */

exports.list = function(req, res, db){
  db.ping(function(err, reply){
    res.send(reply);
  });
};
