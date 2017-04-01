// create the controller and inject Angular's $scope
mainApp.controller('contactController', ['$scope','alertService', function ($scope, alertService) {
	// create a message to display in our view
	$scope.message = 'Want to contact me? Go ahead :)';
	$scope.alerts = alertService.alerts;
	var originalData = angular.copy($scope.contact);
	
	$scope.phone_minlength = 7;
	$scope.phone_maxlength = 16;
	$scope.website_minlength = 2;
	$scope.website_maxlength = 2000;
	$scope.message_minlength = 10;
	$scope.message_maxlength = 2000;	
	
	  /**
	  would use http post to php server side to do extra validation and sanitising of data on contact 
	  but since we are not doing server side I will just respond with a success alert
	  **/	
	$scope.save = function() {	
	  $scope.$broadcast('show-errors-check-validity');
	  alertService.clear(); //always clear alerts when re-submitting
	  if ($scope.contactForm.$valid) {
		alertService.addAlert('success', 'Thank you for your time we will soon be in contact with you');
		angular.copy(originalData, $scope.contact); //angular cloning want to reset the contacts as well as errors 
		$scope.$broadcast('show-errors-reset');
	  } else{
		alertService.addAlert('danger', 'Please resolve the errors below');
	  }
	}
	
	//when page changes the scope for this controller get destroyed and with it we clear the current stored alerts
	$scope.$on('$destroy', function() {
		alertService.clear();
    });
	
}]);