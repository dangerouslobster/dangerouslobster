angular.module('cleaverApp',
  ['ui.router',
    'cleaver.controllers',
    'cleaver.services',
    'ngAnimate'
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
    .state('home.recs', {
        templateUrl: 'views/recs.html',
        url: '^/{uniqueID:[a-z0-9]{6}}'
    });

});
