angular.module('cleaverApp', [])

.factory('Rec', ['$http', function($http) {
  return {
    get : function() {
      return $http.get('/api/uniqueID');
    },

    create : function(data) {
      return $http.post('/api/uniqueID', data);
    }
  }
}]);
