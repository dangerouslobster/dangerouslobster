var authConfig = require('../config/authConfig.js');
var yelp = require('./yelpApi.js');
var utils = require('./utils.js');
var fs = require('fs');
/*
Creates an instance of Recommendation Session

@constructor
@this {RecSession}
@param {string} loc The user-input location (zip code, address, etc).
@param {string} uid The randomly generated UID for this session.
@param {number} numRecs number of recommendations to return.
*/

var RecSession = function(loc, uid) {
  this.location = loc;
  this.uniqueID = uid;
  this.yelpData;
};

/*
Gets the restaurant data from Yelp and saves it in the instance of RecSession.

@this {RecSession}
@param {callback} cb The callback to invoke with (err, data, res)
*/

RecSession.prototype.getYelpData = function(cb) {
  var yelpClient = new yelp.YelpClient(authConfig);
  this.yelpClient = yelpClient;
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
    searchParams.offset = 20;
    searchParams.limit = 20;
    yelpClient.searchRestaurants(searchParams, function(err, data, res){
      if (err) {
        console.error('Error - Yelp API returned: ', err);
      }
      this.yelpData.businesses = this.yelpData.businesses.concat(data.businesses);
      console.log(this.yelpData.businesses.length)
      cb(err, this.yelpData, res);
    }.bind(this))
  }.bind(this));
};

module.exports = RecSession;
