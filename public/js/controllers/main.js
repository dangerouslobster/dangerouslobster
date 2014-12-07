angular.module('cleaver.controllers', [])

.controller('MainController', function($scope, $state, Rec) {
  angular.extend($scope, Rec);
  $scope.vetoRestaurant = function(restaurantID){
    Rec.vetoRestaurant(restaurantID);
    $scope.lastVeto = {
      key: 'id',
      val: restaurantID
    }
  };

  $scope.vetoCategory = function(category){
    Rec.vetoCategory(category);
    $scope.lastVeto = {
      key: 'category',
      val: category
    }
  };

  //TODO: clear input box on enter
  $scope.enter = function(keyEvent, location) {
    if (location && keyEvent.which === 13) {
      $scope.postLocation(location);
    }
  };

});
