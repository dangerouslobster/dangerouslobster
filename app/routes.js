var utils = require('./utils');
var RecSession = require('./recSession.js');
var RecSessions = require('./recSessions.js');

// Instantiate a collection of RecSessions
var recSessions = new RecSessions();
// Cache for sessions by location
var locationCache = {};

// A utility function to get an existing session for requests to /uniqueID
// Sends 404 if session doesnt exist.
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
    var location = req.body.location;
    // Creates new RecSession and adds it to collection on every post to /location
    var recSession = new RecSession(location, utils.generateUID());
    recSessions.addSession(recSession);
    // Set the initial maximum distance
    recSession.fb.child(recSession.uniqueID + '/maxDistance').update({val: 1});
    // Checks if location is cached or if cached location is older than 3 days.
    if(!locationCache[location] || (Date.now() -locationCache[location].createdAt > 259200000)){
      // Refreshes location cache/gets new data.
      recSession.getYelpData(function(err, data){
        // Stores yelpData in locationCache, keyed by location
        locationCache[location] = {
          createdAt: Date.now(),
          data: data
        };
        res.json({
          uniqueID: recSession.uniqueID,
          yelpData: data
        });
      });
    }else{
      console.log('cached', location);
      data = locationCache[location].data;
      // Returns cached result
      recSession.yelpData = data;
      res.json({
        uniqueID: recSession.uniqueID,
        yelpData: data
      });
    }
  });
  app.get('/:uid', function(req, res) {
    // For returning users, the UID is used to check if the associated session exists, then data is sent if exists.
    validateSession(req, res, function(_req, _res, thisSession) {
      _res.send(thisSession.yelpData);
    });
  });

};
