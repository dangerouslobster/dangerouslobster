var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

// Function for scraping dollar sign data based on location.
var scrapeDollars = function(loc, dollars){
  if(typeof loc === 'number'){
    loc = loc.toString();
  };
  for(var i=0;i<5;i++){
    // Using yelp's own request URLs. (not public API)
    var url = 'http://www.yelp.com/search/snippet?find_desc=restaurants&find_loc='+loc+'&start=' + (10*i).toString();
    request.get(url, function(err, res, data){
      if(err){console.log(err, 'err')};

      var results = JSON.parse(data);
      var $ = cheerio.load(results.search_results);

      // Find all restaurants (they have class .media-story)
      var mapped = $('.media-story').map(function(i, el){
        // Get href attribute (it has the restaurant id)
        var name = $(this).find('.biz-name').attr('href');
        // Get dollar data
        var price = $(this).find('.price-range').text();
        // If name exists, set the appropriate attribute on the dollars firebase object.
        if(name &&  name.length > 0){
          var updateObj = {};
          updateObj[name.split('/')[2]] = price;
          console.log(updateObj);
          // dollars.update();
        }
      })
    })
  }
};

exports.scrapeDollars = scrapeDollars;
