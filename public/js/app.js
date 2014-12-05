angular.module('cleaverApp',
	['ui.router',
     'cleaver.controllers',
     'cleaver.services'
	])
//TODO: Change to ui-router
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
    	templateUrl: 'views/home.html',
    	controller: 'MainController',
    	url: '/'
    })
    .state('rec', {
    	templateUrl: 'views/rec.html',
    	// controller: 'RecController',
    	url: '/rec'
    });
});
