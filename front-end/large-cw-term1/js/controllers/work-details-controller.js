// create the controller and inject Angular's $scope
mainApp.controller('workDetailsController', ['$scope', '$stateParams', '$sce', 'work','localStorageService', function ($scope, $stateParams, $sce, work, localStorageService) {
	$scope.trustAsHtml = $sce.trustAsHtml;
	$scope.trustAsResourceURL = $sce.trustAsResourceURL;
	$scope.myInterval = 5000;
	$scope.noWrapSlides = false;
	$scope.active = 0;
	var currIndex = 0;
	  
	$scope.slides = [
		  {
			  image: 'images/portfolio/code-runner-game.png',
			  text: 'Code Runner Game',
			  id: currIndex++
		  },
		  {
			  image: 'images/portfolio/pong-game.png',
			  text: 'Pong Game',
			  id: currIndex++
		  },
		  {
			  image: 'images/portfolio/simon-game.png',
			  text: 'Simon Memory Game',
			  id: currIndex++
		  },
		  {
			  image: 'images/portfolio/triangle-art.png',
			  text: 'Triangle Art',
			  id: currIndex++
		  }		  
	];
  
	//if stateParam exists set to localStorage
	if($stateParams.companyName != undefined){
		localStorageService.set('company_name', $stateParams.companyName);
	}

	// create a message to display in our view	
	$scope.message = 'work details!';
	//local storage sets scope variable
	$scope.companyName = localStorageService.get('company_name');
	$scope.work_experience = work;
}]);