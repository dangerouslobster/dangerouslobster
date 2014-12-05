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
      console.log('added location', resp);
    });
  };

  var getRestaurants = function(uniqueID) {
    return $http({
      method: 'GET',
      url: '/' + uniqueID
    })
    .then(function (resp) {
      console.log('get restaurants: ', resp.data);
      restaurants = resp.data;
    });
  };

  var vetoCategory = function(uniqueID, category) {
    return $http({
      method: 'POST',
      url: '/' + uniqueID,
      data: {key: "category", val: category}
    }).then(function(resp) {
      console.log('vetoed category: ', resp);
    });
  };

  var vetoRestaurant = function(uniqueID, restaurantID) {
    return $http({
      method: 'POST',
      url: '/' + uniqueID,
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
    restaurants: restaurants,
    id: id
  };
});
// }]);
