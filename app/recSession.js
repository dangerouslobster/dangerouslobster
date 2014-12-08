var authConfig = require('../config/authConfig.js');
var yelp = require('./yelpApi.js');
var utils = require('./utils.js');
var fs = require('fs');
var request = require('request');
var Firebase = require('firebase');
var cheerio = require('cheerio');
var fb = new Firebase('https://cleaverapp.firebaseio.com/sessions');

// Function for scraping dollar signs from Yelp, calls callback with (err, data) error, dollar sign
var scrapeDollars = function(url, cb){
  request.get(url, function(err, response, data){
    $ = cheerio.load(data);
    // temporary variable to store dollar signs. This selection actually returns 2 elements with the dollar signs.
    // this means a 2 dollar place will end up $$$$ after .text()
    var tempDollar = $('.business-attribute.price-range').text();
    // use first half of the text, i.e. $$ instead of $$$$
    cb(tempDollar.slice(0, tempDollar.length/2));
  })

};

// Takes in location{string} and unique id{string}
var RecSession = function(loc, uid) {
  this.location = loc;
  this.uniqueID = uid;
};

// Function for running scrapeDollars on all elements of businesses
var scrapeAll = function(businesses, thisDolla){
  for(key in businesses){
    (function(key){
      scrapeDollars(businesses[key].url, function(dollars){
        var updateObj = {};
        updateObj[businesses[key].id] = dollars;
        // Firebase method "update" updates the firebase with new key, value pair
        thisDolla.update(updateObj);
      })
    })(key)
  }
};

// Takes in callback that will be pass (err, yelpData, res)
RecSession.prototype.getYelpData = function(cb) {
  var yelpClient = new yelp.YelpClient(authConfig);
  this.yelpClient = yelpClient;
  // Initialize reference to firebase dollars object.
  this.dollars = fb.child(this.uniqueID + '/dollars');
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
    // scrapes dollar signs for each restaurant

    this.yelpData = data;
    scrapeAll(data.businesses, this.dollars);
    // Used to retrieve next 20 results.
    searchParams.offset = 20;
    searchParams.limit = 20;
    // Sends another request to get next 20 results.
    yelpClient.searchRestaurants(searchParams, function(err, data, res){
      // scrapes dollar signs for each restaurant
      scrapeAll(data.businesses, this.dollars);
      if (err) {
        console.error('Error - Yelp API returned: ', err);
      }
      this.yelpData.businesses = this.yelpData.businesses.concat(data.businesses);
      // callback passed into getYelpData is called if all dollar signs are back.
      if(this.yelpData.dollars = this.yelpData.businesses.length){
        cb(err, this.yelpData, res);
      }
    }.bind(this));
  }.bind(this));
};

module.exports = RecSession;
