angular.module('cleaverApp', [])

.factory('Rec', ['$http', function($http) {
  return {
    getRestaurants: function(uniqueID) {
      var promise = $http.get('/api/' + uniqueID)
      .success(function(data, status, config, headers){
        restaurantData = data;
      })
      .error(function(){
        console.log('error getting restaurants');
      });
    },
    
    postLocation: function(data) {
      $http.post('/location', data)
    },

    restaurants: function() { return restaurantData; };
  }
}]);