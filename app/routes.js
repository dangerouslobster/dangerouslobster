var utils = require('./utils');
var location = require('./models/location');

module.exports = function(app) {
  app.post('/location', function(req, res) {
    var uniqueID = utils.generateUID();
    location.uniqueID = {};
    location.location = req.body.location;
    // make request to Yelp API
    // shape Yelp results into something returnable
    res.status(200).send({locationData: location, yelpData: 'yelpData'});
  });
};
