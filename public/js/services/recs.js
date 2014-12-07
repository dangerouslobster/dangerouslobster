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

  if (data.restaurants.length === 0 && $location.path() !== '/') {
    getExistingSession($location.path().substr(1));
  }

  return {
    calculateScore: calculateScore,
    postLocation: postLocation,
    vetoRestaurant: vetoRestaurant,
    vetoCategory: vetoCategory,
    data: data
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
});
