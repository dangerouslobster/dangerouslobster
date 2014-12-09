angular.module('cleaver.services', ['firebase'])

// This factory handles requests between the client and server
.factory('Rec', function($http, $location, $firebase) {
  var data = {restaurants: []};

  // Create Firebase reference and set up three-way data binding
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

  // Secret sauce! The reviews and stars are weighted and the result of the calculation is used for sorting
  var calculateScore = function(restaurant) {
    var weightedReviews = Math.log(restaurant.review_count)/Math.log(10);
    var weightedStars = Math.pow(restaurant.rating, 1.5);

    return -(weightedReviews * weightedStars);
  };

  // Get an existing session from the server if one exists
  var getExistingSession = function(uniqueID) {
    return $http({
      method: 'GET',
      url: '/' + uniqueID
    }).success(function(resp) {
      // Session has been found, set the necessary data to the data object
      data.id = uniqueID;
      data.restaurants = resp.businesses;

      // Because Yelp doesn't give us a distance, we have to calculate it ourselves
      for (var key in data.restaurants) {
        data.restaurants[key].distance = calculateDistance(resp.region.center.longitude,resp.region.center.latitude,
          data.restaurants[key].location.coordinate.longitude, data.restaurants[key].location.coordinate.latitude);
      }

      setupFirebase(data.id);
    }).error(function(err) {
      // Session doesn't exist anymore, redirect home
      $location.path('/');
    });
  };

  // Once a user submits an address, send it to the server
  var postLocation = function(location) {
    return $http({
      method: 'POST',
      url: '/location',
      data: { location: location }
    }).then(function(resp) {
      // Update data storage with server response
      data.id = resp.data.uniqueID;
      data.restaurants = resp.data.yelpData.businesses;
      // Toggle loading spinner over search icon
      setTimeout(function() {
        angular.element(document.querySelector('i')).toggleClass('search').toggleClass('spinner loading');
      }, 500);
      // Because Yelp doesn't give us a distance, we have to calculate it ourselves
      for (var key in data.restaurants) {
        data.restaurants[key].distance = calculateDistance(resp.data.yelpData.region.center.longitude,resp.data.yelpData.region.center.latitude,
          data.restaurants[key].location.coordinate.longitude, data.restaurants[key].location.coordinate.latitude);
      }

      setupFirebase(data.id);
      $location.path('/' + data.id);
    });
  };

  // This function gets called when a restaurant is vetoed
  var vetoRestaurant = function(restaurantID) {
    data.restaurantVetoes[restaurantID] = true;
    data.restaurantVetoes.$save();
    angular.element(document.querySelectorAll('#undoButton')).removeClass('disabled');

  };

  // This function gets called when a category is vetoed
  var vetoCategory = function(category) {
    data.categoryVetoes[category] = true;
    data.categoryVetoes.$save();
    angular.element(document.querySelectorAll('#undoButton')).removeClass('disabled');
  };

  // Given two sets of coordinates, calculate distance between them in miles
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

  // On an undo, remove the stored category or restaurant veto
  var undo = function(lastVeto){
    if(lastVeto.key === 'category'){
      delete data.categoryVetoes[lastVeto.val];
      data.categoryVetoes.$save();
    }else{
      delete data.restaurantVetoes[lastVeto.val];
      data.restaurantVetoes.$save();
    }
  };

  // Return the current distance filter value, or, if it doesn't exist, set to a default
  var maxDistance = function(maxDistance){
    if(typeof maxDistance !== 'undefined'){
      data.maxDistance.val = maxDistance;
      data.maxDistance.$save();
    }else{
      if (!data.maxDistance) { return 1; }
      return data.maxDistance.val;
    }
  };

  // This function will trigger the big ban overlay when invoked
  var overlayBan = function(index) {
    angular.element(document.querySelectorAll('.overlay')[index]).toggleClass('hover');
  };

  // If the URL path is not '/', attempt to retrieve an existing session
  if (data.restaurants.length === 0 && $location.path() !== '/') {
    getExistingSession($location.path().substr(1));
  }

  return {
    calculateScore: calculateScore,
    postLocation: postLocation,
    vetoRestaurant: vetoRestaurant,
    vetoCategory: vetoCategory,
    calculateDistance: calculateDistance,
    data: data,
    undo: undo,
    maxDistance: maxDistance,
    overlayBan: overlayBan
  };
})
// This filter removes vetoed restaurants or categories
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
// This filter removes restaurants that are further than the current maximum
.filter('filterDistance', function() {
  return function(restaurants, maxDistance){
    var filteredResults = [];
    restaurants.forEach(function(restaurant) {
      if(restaurant.distance < maxDistance) {
        filteredResults.push(restaurant);
      }
    });
    return filteredResults;
  };
})
// This filter removes permanently closed restaurants
.filter('removeClosedPerm', function() {
  return function(restaurants) {
    // check for closed restaurants
    var filteredResults = [];
    restaurants.forEach(function(restaurant) {
      if (!restaurant.is_closed) {
        filteredResults.push(restaurant);
      }
    });
    return filteredResults;
  };
});
