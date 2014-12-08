var authConfig = require('../config/authConfig.js');
var yelp = require('./yelpApi.js');
var utils = require('./utils.js');
var fs = require('fs');

// Takes in location{string} and unique id{string}
var RecSession = function(loc, uid) {
  this.location = loc;
  this.uniqueID = uid;
};

// Takes in callback that will be pass (err, yelpData, res)
RecSession.prototype.getYelpData = function(cb) {
  var yelpClient = new yelp.YelpClient(authConfig);
  this.yelpClient = yelpClient;
  // Parameters passed to Yelp API
  var searchParams = {
    sort: 1,
    radius_filter: 5000,
    location: this.location
  };
// First Yelp API request.
  yelpClient.searchRestaurants(searchParams, function(err, data, res) {
    if (err) {
      console.error('Error - Yelp API returned: ', err);
    }

    this.yelpData = data;
    // Used to retrieve next 20 results.
    searchParams.offset = 20;
    searchParams.limit = 20;
    // Sends another request to get next 20 results.
    yelpClient.searchRestaurants(searchParams, function(err, data, res){
      if (err) {
        console.error('Error - Yelp API returned: ', err);
      }
      this.yelpData.businesses = this.yelpData.businesses.concat(data.businesses);
      // callback passed into getYelpData is called
      cb(err, this.yelpData, res);
    }.bind(this));
  }.bind(this));
};

module.exports = RecSession;
