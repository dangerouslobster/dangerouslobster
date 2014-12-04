angular.module('cleaver.controllers', [])

.controller('MainController', function($scope, Rec) {
  $.extend($scope, Rec);
});
