// create the controller and inject Angular's $scope
mainApp.controller('workController', ['$scope', function ($scope) {
	// create a message to display in our view
	$scope.message = 'Time to work!';
	$scope.workList = workList;
	$scope.queryBy = "name";
	//$scope.query = ''[queryBy]
	
	    $scope.data = { active: false };
}]);