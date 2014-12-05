angular.module('cleaver.services', [])

// this factory handles requests between the client and server

.factory('Rec', function($http) {
  var data = {};

  var postLocation = function(location) {
    return $http({
      method: 'POST',
      url: '/location',
      data: { location: location }
    }).then(function(resp) {
      data.id = resp.data.uniqueID;
      data.recs = resp.data.recs;
    });
  };

  var getRestaurants = function() {
    return $http({
      method: 'GET',
      url: '/' + data.id
    })
    .then(function (resp) {
      data.recs = resp.data;
    });
  };

  var vetoCategory = function(category) {
    return $http({
      method: 'POST',
      url: '/' + data.id,
      data: {key: "category", val: category}
    }).then(function(resp) {
      data.recs = resp.data;
    });
  };

  var vetoRestaurant = function(restaurantID) {
    return $http({
      method: 'POST',
      url: '/' + data.id,
      data: {key: "id", val: restaurantID}
    }).then(function(resp) {
      data.recs = resp.data;
    });
  };

  return {
    getRestaurants: getRestaurants,
    postLocation: postLocation,
    vetoRestaurant: vetoRestaurant,
    vetoCategory: vetoCategory,
    data: data
  };
});
