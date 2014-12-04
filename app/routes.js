var utils = require('./utils');
var models = require('./models.js');

module.exports = function(app) {
  app.post('/location', function(req, res) {
    console.log(req.body.location);
    var location = new models.Location(req.body.location, utils.generateUID());
    // make request to Yelp API
    // shape Yelp results into something returnable
    res.status(200).send({locationData: location, yelpData: 'yelpData'});
  });
};
