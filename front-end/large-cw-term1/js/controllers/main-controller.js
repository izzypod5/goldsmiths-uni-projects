// create the controller and inject Angular's $scope
mainApp.controller('mainController', ['$scope', 'alertService', function ($scope, alertService) {
	$scope.currentYear = new Date().getFullYear();
	$scope.alertService = alertService;
	$scope.navCollapsed = true;
}]);