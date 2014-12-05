var authConfig = require('../config/authConfig.js');
var yelp = require('./yelpApi.js');

/*
Creates an instance of Recommendation Session

@constructor
@this {RecSession}
@param {string} loc The user-input location (zip code, address, etc).
@param {string} uid The randomly generated UID for this session.
*/

var RecSession = function(loc, uid) {
  this.location = loc;
  this.uniqueID = uid;
};

/*
Vetoes a restaurant or food category, removing it from the recommendations.

@param {object} The veto request. Should have key, val properties, where the key is either id or category.
*/

RecSession.prototype.veto = function(whatToVeto) {
  if (whatToVeto.key === 'id') {
    // TODO
  } else if (whatToVeto.key === 'category') {
    // TODO
  } else {
    console.error('Error: invalid argument');
  }
};

/*
Gets the restaurant data from Yelp and saves it in the instance of RecSession.

@this {RecSession}
@param {callback} cb The callback to invoke with (err, data, res)
*/

RecSession.prototype.getYelpData = function(cb) {
  var yelpClient = new yelp.YelpClient(authConfig);
  var searchParams = {
    sort: 1,
    radius_filter: 5000,
    location: this.location
  };

  yelpClient.searchRestaurants(searchParams, function(err, data, res) {
    if (err) {
      console.error('Error - Yelp API returned: ', err);
    }

    this.yelpData = data;
    cb(err, data, res);
  }.bind(this));
};

module.exports = RecSession;
