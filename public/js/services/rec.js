angular.module('cleaver.services', [])

// this factory handles requests between the client and server

// .factory('Rec', ['$http', '$routeParams', function($http) {
.factory('Rec', function($http) {
  var restaurants;

  var postLocation = function(location) {
    return $http({
      method: 'POST',
      url: '/location',
      data: { location: location }
    }).then(function(resp) {
      console.log('added location', resp);
    });
  };

  var getRestaurants = function(uniqueID) {
    return $http({
      method: 'GET',
      url: '/api/' + uniqueID
    })
    .then(function (resp) {
      console.log('get restaurants: ', resp.data);
      restaurants = resp.data;
    });
  };

  // var vetoFood = function(food) {
  //   return $http({
  //     method: 'POST',
  //     url: '/api/',
  //     data: { food: food } // ???
  //   }).then(function(resp) {
  //     console.log('vetoed food: ', resp);
  //   });
  // };

  // var vetoRestaurant = function(restaurant) {
  //   return $http({
  //     method: 'POST',
  //     url: '/api/',
  //     data: { restaurant: restaurant } // ???
  //   }).then(function(resp) {
  //     console.log('vetoed restaurant: ', resp);
  //   });
  // };

  return {
    getRestaurants: getRestaurants,
    postLocation: postLocation,
    // vetoRestaurant: vetoRestaurant,
    // vetoFood: vetoFood,
    restaurants: restaurants
  };
});
// }]);
