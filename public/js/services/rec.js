angular.module('cleaverApp', [])

// this factory handles requests between the client and server

.factory('Rec', ['$http', function($http) {
  var restaurants;

  var getRestaurants = function (uniqueID) {
    return $http({
      method: 'GET',
      url: '/api/' + uniqueID
    })
    .then(function (resp) {
      console.log("get restaurants", resp.data);
      restaurants = resp.data;
    });
  };

  var addLocation = function() {
    return $http({
      method: 'POST',
      url: '/api/location',
      // data: { url:link }
    }).then(function(resp) {
      console.log("added location", resp);
    });
  };

  return {
    getRestaurants: getRestaurants,
    addLocation: addLocation,
    restaurants: restaurants
  };

}]);
