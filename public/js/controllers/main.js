angular.module('cleaver.controllers', [])

.controller('MainController', function($scope, $stateParams, Rec) {
  angular.extend($scope, Rec);
  $scope.enter = function(keyEvent, location) {
    if (location && keyEvent.which === 13) {
      $scope.postLocation(location);
    }
  }
  // $scope.get = getRestaurants($scope.location);
});
