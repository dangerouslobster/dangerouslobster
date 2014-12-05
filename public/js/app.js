angular.module('cleaverApp', ['ui.router'])
//TODO: Change to ui-router
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
    	templateUrl: 'views/home.html',
    	controller: 'MainController',
    	url: '/'
    });
});
