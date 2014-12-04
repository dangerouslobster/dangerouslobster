angular.module('cleaverApp', [])

.controller('MainController', function($scope, Rec) {
  $.extend($scope, Rec);
});
