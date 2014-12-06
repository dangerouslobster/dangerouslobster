angular.module('cleaver.services', ['firebase'])


// this factory handles requests between the client and server
.factory('Rec', function($http, $firebase) {
  var data = {};

  var setupFirebase = function(uniqueID) {
    var fb = new Firebase('https://cleaverapp.firebaseio.com/sessions');

    var ref = fb.child(uniqueID + '/categoryVetoes');
    data.categoryVetoes = $firebase(ref).$asArray();

    var ref = fb.child(uniqueID + '/restaurantVetoes');
    data.restaurantVetoes = $firebase(ref).$asArray();
  };

  var postLocation = function(location) {
    return $http({
      method: 'POST',
      url: '/location',
      data: { location: location }
    }).then(function(resp) {
      data.id = resp.data.uniqueID;
      data.yelpData = resp.data.yelpData;

      setupFirebase(data.id);
    });
  };

  var vetoCategory = function(category) {
    data.categoryVetoes.$add({category: category});
  };

  var vetoRestaurant = function(restaurantID) {
    data.restaurantVetoes.$add({restaurantID: restaurantID});
  };

  return {
    postLocation: postLocation,
    vetoRestaurant: vetoRestaurant,
    vetoCategory: vetoCategory,
    data: data
  };
})
.filter('removeVetoes', function(restaurantVetoes, categoryVetoes) {
  return function(restaurant) {
    // check for restaurant vetoes
    for (var i = 0; i < restaurantVetoes.length; i++) {
      if (restaurantVetoes[i].id === restaurant.id) {
        return false;
      }
    }
    // check for category vetoes
    for (var i = 0; i < categoryVetoes; i++) {
      for (var j = 0; j < restaurant.categories[0].length; j++) {
        if (categoryVetoes[i].category === restaurant.categories[0][j]) {
          return false;
        }
      }
    }
    return true;
  }
});
