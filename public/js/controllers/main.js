angular.module('cleaver.controllers', [])

.controller('MainController', function($scope, $stateParams, Rec) {
  angular.extend($scope, Rec);
  var currentId = $stateParams.id;
  // $scope.getRestaurants(currentId);
  // veto(business_id);
  // postLocation(location);
});
