angular.module('cleaver.controllers', ['ngAutocomplete'])

.controller('MainController', function($scope, $state, Rec) {
  angular.extend($scope, Rec);
  $scope.stateIs = $state.is;
  $scope.inputOptions = {
    types: 'geocode',
    country: 'us',
    watchEnter: true
  };
  $scope.lastVeto = {};

  angular.element(document.body).css('background-image', 'url("../img/background_' +
    (Math.floor(Math.random() * 5) + 1) + '.jpg")');

  $scope.formatUndo = function(){
    if($scope.lastVeto && $scope.lastVeto.val){
      if($scope.lastVeto.key === 'category'){
        return $scope.lastVeto.val;
      }else{
        var results = [];
        var splitUp = $scope.lastVeto.val.split('-');
        splitUp.forEach(function(el){
          results.push(el.charAt(0).toUpperCase() + el.slice(1));
        });
        return results.join(' ');
      }
    }
  };

  $scope.undoIt = function(){
    Rec.undo($scope.lastVeto);
    $scope.lastVeto = {};
    angular.element(document.querySelectorAll('#undoButton')).addClass('disabled');
  };

  $scope.vetoRestaurant = function(restaurantID){
    Rec.vetoRestaurant(restaurantID);
    $scope.lastVeto = {
      key: 'id',
      val: restaurantID
    };
  };

  $scope.vetoCategory = function(category){
    Rec.vetoCategory(category);
    $scope.lastVeto = {
      key: 'category',
      val: category
    };
  };

  // submits the user's location input
  $scope.enterLocation = function(keyEvent) {
    if ($scope.details && (keyEvent === undefined || keyEvent.which === 13)) {
      $scope.postLocation($scope.details.formatted_address.slice(0, -5));
      $scope.details = null;
      angular.element(document.querySelector('i')).toggleClass('search').toggleClass('spinner loading');
    }
  };

});
