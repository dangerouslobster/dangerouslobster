angular.module('cleaver.services', [])

// this factory handles requests between the client and server

// .factory('Rec', ['$http', '$routeParams', function($http) {
.factory('Rec', function($http) {
  var id;

  var postLocation = function(location) {
    return $http({
      method: 'POST',
      url: '/location',
      data: { location: location }
    }).then(function(resp) {
      id = resp.data.uniqueID;
      console.log('added location: \n', resp);
    });
  };

  var getRestaurants = function() {
    return $http({
      method: 'GET',
      url: '/' + id
    })
    .then(function (resp) {
      console.log('get restaurants: \n', resp);
    });
  };

  var vetoCategory = function(category) {
    return $http({
      method: 'POST',
      url: '/' + id,
      data: {key: "category", val: category}
    }).then(function(resp) {
      console.log('vetoed category: ', resp);
    });
  };

  var vetoRestaurant = function(restaurantID) {
    return $http({
      method: 'POST',
      url: '/' + id,
      data: {key: "id", val: restaurantID}
    }).then(function(resp) {
      console.log('vetoed restaurant: ', resp);
    });
  };

  return {
    getRestaurants: getRestaurants,
    postLocation: postLocation,
    vetoRestaurant: vetoRestaurant,
    vetoCategory: vetoCategory,
    id: id
  };
});
// }]);
