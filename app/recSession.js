var authConfig = require('../config/authConfig.js');
var yelp = require('./yelpApi.js');
var Heap = require('heap');
var utils = require('./utils.js');
var fs = require('fs');
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

var RecSession = function(loc, uid, numRecs) {
  this.location = loc;
  this.uniqueID = uid;
  this.recommendations = {};
  this.vetoes = {};
  this.numRecs = numRecs;
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

/*
Builds the recommendation queue.

@param {callback} cb The callback to invoke with (recommendations)
*/
RecSession.prototype.buildRecommendation = function(cb){
  var subCallback = function(err, data, res){
    if(!err){
      fs.appendFileSync('logs.txt', JSON.stringify(data))

      this.lat = data.region.center.latitude;
      this.longi = data.region.center.longitude;
      this.recQueue = data.businesses;
      this.recQueue.sort(function(a, b){
        return utils.calculateScore(this.lat, this.longi, a) - utils.calculateScore(this.lat, this.longi, b);
      }.bind(this));

      for(var i=0;i<this.numRecs && this.recQueue.length > 0;i++){
        var current = this.recQueue.pop();
        var vetoed = false;
        if(this.vetoes[current.url]){
          vetoed = true;
        };
        for(var j=0;j++;j<current.categories.length){
          if(this.vetoes[current.categories[i]]){
            vetoed = true;
          }
        };
        if(!vetoed){
          this.recommendations[current.url] = current;
        }else{
          i --;
        }
      }

      cb(this.recommendations);
    }
  };

  this.getYelpData(subCallback.bind(this));
};

RecSession.prototype.getRecs = function(){
  return this.recommendations;
};

RecSession.prototype.veto = function(command) {

};
module.exports = RecSession;

// (location, uid, numRecommendations)
// var testsesh = new RecSession('94103', 0, 3);
// testsesh.buildRecommendation(function(recs){
//   console.log(Object.keys(recs))
// })
