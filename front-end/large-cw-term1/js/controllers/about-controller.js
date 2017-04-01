// create the controller and inject Angular's $scope
mainApp.controller('aboutController', ['$scope', function ($scope) {
  $scope.currentView = 'chess.html';
  $scope.setView = function(path) {
		$scope.currentView = path;
  }; 
  
 }]);