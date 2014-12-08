var OAuth = require('oauth').OAuth;
var queryStr = require('querystring');

var urlTemplate = "http://api.yelp.com/v2/search?";
// Client for sending YelpAPI requests.

// takes in  authConfig
// OAuth configuration object of the form {
// OAuthToken: Token,
// OAuthTokenSecret: Token Secret,
// key: Consumer Key,
// secret: Consumer Secret
// }

var YelpClient = function(authConfig){
  this.auth = new OAuth(null, null, authConfig.key, authConfig.secret, "1.0", null, 'HMAC-SHA1');
  this.OAuthToken = authConfig.OAuthToken;
  this.OAuthTokenSecret = authConfig.OAuthTokenSecret;
};

// Calls Yelp Search API - Generic
// Takes in params object that is converted into query strings.
// Takes in callback that is called with (err, data, res)
YelpClient.prototype.searchStuff = function(params, cb){
  this.auth.get(urlTemplate + queryStr.stringify(params),
    this.OAuthToken,
    this.OAuthTokenSecret,
    function(err, data, res){
      if(!err){
        data = JSON.parse(data);
      }
      cb(err, data, res);
    }
  );
};

// Special function that searches for restaurants.
YelpClient.prototype.searchRestaurants = function(params, cb){
  params.category_filter = 'restaurants';
  this.searchStuff(params, cb);
};

exports.YelpClient = YelpClient;


// // EXAMPLE USAGE
// var authConfig = {
//   OAuthToken: 'Token',
//   OAuthTokenSecret: 'TokenSecret',
//   key: 'Consumer Key',
//   secret: 'Consumer Secret'
// };

// For testing purposes(command line use);
// authConfig.OAuthToken = process.argv[2];
// authConfig.OAuthTokenSecret = process.argv[3];
// authConfig.key = process.argv[4];
// authConfig.secret = process.argv[5];

// var test = new YelpClient(authConfig);

// test.searchRestaurants({
//   sort: '2',
//   radius_filter: 1000,
//   location: '944 Market Street, #8 San Francisco, CA 94102'
// }, function(err, data, res){
//   console.log(err, data)
// })
