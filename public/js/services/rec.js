angular.module('cleaverApp', [])

// this factory handles requests between the client and server

.factory('Rec', ['$http', function($http) {
  return {
    getRestaurants: function(uniqueID) {
      var promise = $http.get('/api/' + uniqueID)
      .success(function(data, status, config, headers){
        restaurantData = data;
      })
      .error(function(){
        console.error('error getting restaurants');
      });
    },
    
    postLocation: function(data) {
      $http.post('/location', data)
    },
    restaurants: function() { return restaurantData; };
  }
}]);
