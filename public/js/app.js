angular.module('cleaverApp',
	['ui.router',
     'cleaver.controllers'
	])
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
