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
<<<<<<< HEAD
=======
@param {number} numRecs number of recommendations to return.
>>>>>>> 373016a39406ec7f9c5c1521fd89c526b934b7dd
*/

var RecSession = function(loc, uid, numRecs) {
  this.location = loc;
  this.uniqueID = uid;
  this.recommendations = {};
  this.vetoes = {};
  this.numRecs = numRecs;
  this.recQueue = [];
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
<<<<<<< HEAD
    radius_filter: 5000,
=======
    radius_filter: 1000,
>>>>>>> 373016a39406ec7f9c5c1521fd89c526b934b7dd
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
<<<<<<< HEAD

=======
>>>>>>> 373016a39406ec7f9c5c1521fd89c526b934b7dd
/*
Builds the recommendation queue.

@param {callback} cb The callback to invoke with (recommendations)
*/
RecSession.prototype.buildRecommendation = function(cb){
  var subCallback = function(err, data, res){
    if(!err){
      this.lat = data.region.center.latitude;
      this.longi = data.region.center.longitude;
      this.recQueue = data.businesses;
      this.recQueue.sort(function(a, b){
        return utils.calculateScore(this.lat, this.longi, a) - utils.calculateScore(this.lat, this.longi, b);
      }.bind(this));

      for(var i=0;i<this.numRecs && this.recQueue.length > 0;i++){
        var current = this.recQueue.pop();
        var vetoed = false;
        if(this.vetoes[current.id]){
          vetoed = true;
        };
        for(var j=0;j++;j<current.categories.length){
          if(this.vetoes[current.categories[i]]){
            vetoed = true;
          }
        };
        if(!vetoed){
          this.recommendations[current.id] = current;
        }else{
          i --;
        }
      }

      cb(this.recommendations);
    }
  };

  this.getYelpData(subCallback.bind(this));
};
/*
Returns recs

@returns {object} Object of recommendations keyed by id.
*/
RecSession.prototype.getRecs = function(){
  return this.recommendations;
};
/*
Adds veto to session

@param {object} Takes command object of form {key: 'id'|'object', val: valueToVeto}
*/
RecSession.prototype.veto = function(command) {
  // Refactor using lodash later.
  this.vetoes[command.val] = true;
  if(command.key === 'id'){
    delete this.recommendations[command.val];
  }else{
    var keys = Object.keys(this.recommendations);
    for(var i=0;i<keys.length;i++){
      if(this.recommendations[keys[i]].categories[0].indexOf(command.val) > -1){
        delete this.recommendations[keys[i]];
      }
    }
  };
  for(var i=0;i<this.numRecs && this.recQueue.length > 0 && Object.keys(this.recommendations).length < this.numRecs;i++){
    var current = this.recQueue.pop();
    var vetoed = false;
    if(this.vetoes[current.id]){
      vetoed = true;
    };
    // First in array is food-related;
    for(var j=0;j++;j<current.categories[0].length){
      if(this.vetoes[current.categories[0][i]]){
        vetoed = true;
      }
    };
    if(!vetoed){
      this.recommendations[current.id] = current;
    }else{
      i --;
    }
  };

};
module.exports = RecSession;

// // (location, uid, numRecommendations)
// var testsesh = new RecSession('94103', 0, 3);
// testsesh.veto({key:'id', val:'crepes-a-go-go-san-francisco-2'})
// testsesh.buildRecommendation(function(recs){
//   console.log(Object.keys(recs))
//   testsesh.veto({key:'id', val:'so-san-francisco-4'})
//   console.log(Object.keys(testsesh.getRecs()));
//   testsesh.veto({key:'category', val:'asianfusion'})
//   console.log(Object.keys(testsesh.getRecs()));
// })
