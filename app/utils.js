module.exports = {
  generateUID: function() {
    return Math.random().toString(36).substr(2,6);
  },
  calculateDistance: function(lon1, lat1, lon2, lat2){
    dlon = lon2 - lon1;
    dlat = lat2 - lat1;
    a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
    c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1 - a) );
    d = ( 6371 * c ) * 0.621371;
    return d;
  },
  getBaseLog: function(x, base){
    // Rates it 0 if rating is less than or equal to 1.
    if(x <= 1){
      return 0;
    };
    return Math.log(x) / Math.log(base);
  },
  calculateScore: function(lat, longit, data){
    // var distance = module.exports.calculateDistance(longit, lat, data.location.coordinate.longitude, data.location.coordinate.latitude );
    // Multiplies log of review_count by rating^1.5, divides by distance from location.
    return  module.exports.getBaseLog(data.review_count, 10) * Math.pow(data.rating, 1.5);
  }
};


// console.log(module.exports.calculateScore(40.6213710464925, -74.3947637,
//   {
//                 "is_claimed": false,
//                 "rating": 3,
//                 "mobile_url": "http://m.yelp.com/biz/china-star-edison",
//                 "rating_img_url": "http://s3-media3.fl.yelpcdn.com/assets/2/www/img/34bc8086841c/ico/stars/v1/stars_3.png",
//                 "review_count": 16,
//                 "name": "China Star",
//                 "snippet_image_url": "http://s3-media3.fl.yelpcdn.com/photo/CzNKRNV1cIcxKHWT7mIlfA/ms.jpg",
//                 "rating_img_url_small": "http://s3-media3.fl.yelpcdn.com/assets/2/www/img/902abeed0983/ico/stars/v1/stars_small_3.png",
//                 "url": "http://www.yelp.com/biz/china-star-edison",
//                 "menu_date_updated": 1387510771,
//                 "phone": "7329851333",
//                 "snippet_text": "Korean Chinese food. or Chinese Korean , not sure lol. anywAys get noodles, they are homemade says the neon sign.. simple place, low prices. lots of tables....",
//                 "image_url": "http://s3-media2.fl.yelpcdn.com/bphoto/FOr7HkVjR44WkF_ZkR3pdA/ms.jpg",
//                 "categories": [
//                     ["Chinese", "chinese"]
//                 ],
//                 "display_phone": "+1-732-985-1333",
//                 "rating_img_url_large": "http://s3-media1.fl.yelpcdn.com/assets/2/www/img/e8b5b79d37ed/ico/stars/v1/stars_large_3.png",
//                 "menu_provider": "single_platform",
//                 "id": "china-star-edison",
//                 "is_closed": false,
//                 "location": {
//                     "city": "Edison",
//                     "display_address": ["561 US Highway 1", "Edison, NJ 08817"],
//                     "geo_accuracy": 8,
//                     "postal_code": "08817",
//                     "country_code": "US",
//                     "address": ["561 US Highway 1"],
//                     "coordinate": {
//                         "latitude": 40.5063081532717,
//                         "longitude": -74.3948227912188
//                     },
//                     "state_code": "NJ"
//                 }
//               }
//   ))
