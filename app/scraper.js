var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

// Function for scraping dollar sign data based on location.
var scrapeDollars = function(loc, dollars){
  if(typeof loc === 'number'){
    loc = loc.toString();
  }
  var sorts = ['&sortby=rating', '', '&sortby=review_count'];
  for(var j=0;j<3;j++){
    for(var i=0;i<5;i++){
      // Using yelp's own request URLs. (not public API)
      var url = 'http://www.yelp.com/search/snippet?find_desc=restaurants'+sorts[j]+'&find_loc='+loc+'&start=' + (10*i).toString();
      request.get(url, function(err, res, data){
        if(err){console.log(err, 'err');}

        var results = JSON.parse(data);
        var $ = cheerio.load(results.search_results);
        // fs.appendFileSync('logs.html', $.html());
        // Find all restaurants (they have class .media-story)
        var mapped = $('.media-story').map(function(i, el){
          // Get restaurant name from href.
          var name = $(this).find('.biz-name').attr('href');
          if(name){
            name = name.split('/');
            if(name[1] === 'biz'){
              name = name[2];
            }else{
              name = null;
            }
          }
          // Get dollar data
          var price = $(this).find('.price-range').text();
          // If name exists, set the appropriate attribute on the dollars firebase object.
          if(name &&  name.length > 0){
            var updateObj = {};
            updateObj[name] = price;
            dollars.update(updateObj);
          }
        });
      });
    }
  }
};

exports.scrapeDollars = scrapeDollars;
