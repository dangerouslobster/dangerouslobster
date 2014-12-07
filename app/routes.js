var utils = require('./utils');
var RecSession = require('./recSession.js');
var RecSessions = require('./recSessions.js');

// Instantiate a collection of RecSessions
var recSessions = new RecSessions();

// A utility function to get an existing session for requests to /uniqueID
var validateSession = function(req, res, cb) {
  var thisSession = recSessions.getSession(req.param('uid'));

  if (!thisSession) {
    res.status(404).send('Not Found');
  } else {
    cb(req, res, thisSession);
  }
};

module.exports = function(app) {
  app.post('/location', function(req, res) {
    var recSession = new RecSession(req.body.location, utils.generateUID());
    recSessions.addSession(recSession);
    recSession.getYelpData(function(err, data){
      res.json({
        uniqueID: recSession.uniqueID,
        yelpData: data
      })
    });
  });
  app.get('/:uid', function(req, res) {
    validateSession(req, res, function(_req, _res, thisSession) {
      _res.send(thisSession.yelpData);
    });
  });

};
