angular.module('cleaver.services', ['firebase'])

// this factory handles requests between the client and server
.factory('Rec', function($http, $location, $firebase) {
  var data = {restaurants: []};

  var setupFirebase = function(uniqueID) {
    var fb = new Firebase('https://cleaverapp.firebaseio.com/sessions');

    var ref = fb.child(uniqueID + '/categoryVetoes');
    data.categoryVetoes = $firebase(ref).$asObject();

    ref = fb.child(uniqueID + '/restaurantVetoes');
    data.restaurantVetoes = $firebase(ref).$asObject();

    ref = fb.child(uniqueID + '/maxDistance');
    data.maxDistance = $firebase(ref).$asObject();

    ref = fb.child('/dollars');
    data.dollars = $firebase(ref).$asObject();
  };

  var calculateScore = function(restaurant) {
    // Secret sauce!
    var weightedReviews = Math.log(restaurant.review_count)/Math.log(10);
    var weightedStars = Math.pow(restaurant.rating, 1.5);

    return -(weightedReviews * weightedStars);
  };

  var getExistingSession = function(uniqueID) {
    return $http({
      method: 'GET',
      url: '/' + uniqueID
    }).success(function(resp) {
      data.id = uniqueID;
      data.restaurants = resp.businesses;
      angular.element(document.querySelector('i')).toggleClass('search').toggleClass('spinner');

      for (var key in data.restaurants) {
        data.restaurants[key].distance = calculateDistance(resp.region.center.longitude,resp.region.center.latitude,
          data.restaurants[key].location.coordinate.longitude, data.restaurants[key].location.coordinate.latitude);
      }

      setupFirebase(data.id);
    }).error(function(err) {
      $location.path('/');
    });
  };

  var postLocation = function(location) {
    return $http({
      method: 'POST',
      url: '/location',
      data: { location: location }
    }).then(function(resp) {
      data.id = resp.data.uniqueID;
      data.restaurants = resp.data.yelpData.businesses;
      angular.element(document.querySelector('i')).toggleClass('search').toggleClass('spinner');

      for (var key in data.restaurants) {
        data.restaurants[key].distance = calculateDistance(resp.data.yelpData.region.center.longitude,resp.data.yelpData.region.center.latitude,
          data.restaurants[key].location.coordinate.longitude, data.restaurants[key].location.coordinate.latitude);
      }

      setupFirebase(data.id);
      $location.path('/' + data.id);
    });
  };

  var vetoRestaurant = function(restaurantID) {
    data.restaurantVetoes[restaurantID] = true;
    data.restaurantVetoes.$save();
  };

  var vetoCategory = function(category) {
    data.categoryVetoes[category] = true;
    data.categoryVetoes.$save();
  };

  var calculateDistance = function(lon1, lat1, lon2, lat2){
    if (typeof(Number.prototype.toRad) === "undefined") {
      Number.prototype.toRad = function() {
        return this * Math.PI / 180;
      };
    }

    dlon = (lon2 - lon1).toRad();
    dlat = (lat2 - lat1).toRad();
    lat1=lat1.toRad();
    lat2=lat2.toRad();
    a = Math.sin(dlat/2) * Math.sin(dlat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
    c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1 - a) );
    d = ( 3963.1676 * c );
    return Math.round(d * 100) / 100;
  };


  if (data.restaurants.length === 0 && $location.path() !== '/') {
    getExistingSession($location.path().substr(1));
  }

  var undo = function(lastVeto){
    if(lastVeto.key === 'category'){
      delete data.categoryVetoes[lastVeto.val];
      data.categoryVetoes.$save();
    }else{
      delete data.restaurantVetoes[lastVeto.val];
      data.restaurantVetoes.$save();
    }
  };

  var maxDistance = function(maxDistance){
    if(typeof maxDistance !== 'undefined'){
      data.maxDistance.val = maxDistance;
      data.maxDistance.$save();
    }else{
      return data.maxDistance.val;
    }
  };

  return {
    calculateScore: calculateScore,
    postLocation: postLocation,
    vetoRestaurant: vetoRestaurant,
    vetoCategory: vetoCategory,
    calculateDistance: calculateDistance,
    data: data,
    undo: undo,
    maxDistance: maxDistance
  };
})
.filter('removeVetoes', function() {
  return function(restaurants, restaurantVetoes, categoryVetoes) {
    var filteredResults = [];
    restaurants.forEach(function(restaurant) {
      // check for restaurant vetoes
      for (var restaurantVeto in restaurantVetoes) {
        if (restaurantVeto === restaurant.id) {
          return;
        }
      }
      // check for category vetoes
      for (var categoryVeto in categoryVetoes) {
        for (var j = 0; j < restaurant.categories.length; j++) {
          if (categoryVeto === restaurant.categories[j][0]) {
            return;
          }
        }
      }
      filteredResults.push(restaurant);
    });
    return filteredResults;
  };
})
.filter('filterDistance', function(){
  return function(restaurants, maxDistance){
    if(typeof maxDistance === 'undefined' || maxDistance === ''){
      maxDistance = Number.POSITIVE_INFINITY;
    }
    var filteredResults = [];
    restaurants.forEach(function(restaurant){
      if(restaurant.distance < maxDistance){
        filteredResults.push(restaurant);
      }
    });
    return filteredResults;
  };
});
