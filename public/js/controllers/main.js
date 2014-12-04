angular.module('cleaver.controllers', [])

.controller('MainController', function($scope, Rec) {
  angular.extend($scope, Rec);
  var currentId = $routeParams.id;
  getRestaurants(currentId);
  // veto(business_id);
  // postLocation(location);
});
