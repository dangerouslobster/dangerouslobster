angular.module('cleaver.controllers', [])

.controller('MainController', function($scope, Rec) {
  angular.extend($scope, Rec);


  //TODO: clear input box on enter
  $scope.enter = function(keyEvent, location) {
    if (location && keyEvent.which === 13) {
      $scope.postLocation(location);
    }
  };

});
