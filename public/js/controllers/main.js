angular.module('cleaver.controllers', ['ngAutocomplete'])

.controller('MainController', function($scope, $state, Rec) {
  angular.extend($scope, Rec);

  $scope.stateIs = $state.is;
  $scope.lastVeto = {};
  $scope.inputOptions = {
    types: 'geocode',
    country: 'us',
    watchEnter: true
  };

  angular.element(document.body).css('background-image', 'url("../img/background_' +
    (Math.floor(Math.random() * 5) + 1) + '.jpg")');

  // takes "enter" key event and submits the user's location input
  $scope.enterLocation = function(keyEvent) {
    if ($scope.details && (keyEvent === undefined || keyEvent.which === 13)) {
      $scope.postLocation($scope.details.formatted_address.slice(0, -5));
      $scope.details = null;
      angular.element(document.querySelector('i')).toggleClass('search').toggleClass('spinner loading');
    }
  };

  // adds vetoed restaurant to the veto array
  $scope.vetoRestaurant = function(restaurantID){
    Rec.vetoRestaurant(restaurantID);
    $scope.lastVeto = {
      key: 'id',
      val: restaurantID
    };
  };

  // adds the vetoed category to veto array
  $scope.vetoCategory = function(category){
    Rec.vetoCategory(category);
    $scope.lastVeto = {
      key: 'category',
      val: category
    };
  };

  // removes the last vetoed category or restaurant from the veto list
  $scope.undoIt = function(){
    Rec.undo($scope.lastVeto);
    $scope.lastVeto = {};
    angular.element(document.querySelectorAll('#undoButton')).addClass('disabled');
  };

});
