angular.module('cleaver.controllers', [])

.controller('MainController', function($scope, Rec) {
  angular.extend($scope, Rec);

  //TODO: clear input box on enter
  $scope.enter = function(keyEvent, location) {
    if (location && keyEvent.which === 13) {
      $scope.postLocation(location);
    }
  }

  // $scope.getRestaurantID = function(restID) {
  //   alert('restaurant id is: ' + restID);
  // };

  // $scope.getCategory = function(category) {
  //   alert('category is: ' + category);
  //   // alert('category index is: ' + catIndex);
  //   // alert('category: ' + $scope.data.recs[restID].categories[catIndex][1]);
  // };

});
