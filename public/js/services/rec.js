angular.module('cleaver.services', [])

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
      console.log('postLocation: \n', data);
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
      console.log('vetoCategory: \n', data);

    });
  };

  var vetoRestaurant = function(restaurantID) {
    return $http({
      method: 'POST',
      url: '/' + data.id,
      data: {key: "id", val: restaurantID}
    }).then(function(resp) {
      data.recs = resp.data;
      console.log('vetoRestaurant: \n', data);
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
