angular.module('cleaverApp', ['ngRoute'])
//TODO: Change to ui-router
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'MainController'
    })
}]);
