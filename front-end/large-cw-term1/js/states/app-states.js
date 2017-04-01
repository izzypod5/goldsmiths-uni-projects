//var mainApp = angular.module('mainApp', ['ui.router']);

mainApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	
    $urlRouterProvider.otherwise("/about");
	
    $stateProvider
        .state('index', {
            url: '/index',
            templateUrl: 'index.html',
			controller: 'mainController',
			ncyBreadcrumb: {
				skip: true
		    }			
			//resolve, data ...
        })		
        .state('about', {
            url: '/about',
            templateUrl: 'about.html',
			controller: 'aboutController',
			ncyBreadcrumb: {
				label: 'About'
		    }			
			//resolve, data ...
        })	
        .state('contact', {
            url: '/contact',
            templateUrl: 'contact.html',
			controller: 'contactController',
			ncyBreadcrumb: {
				label: 'Contact',
				parent: 'about'
		    }			
        })		
        .state('work', {
            url: '/work',
            templateUrl: 'work.html',
			controller: 'workController',
			ncyBreadcrumb: {
				label: 'Work',
				parent: 'about'
		    }			
        })
        .state('details', {
            url: '/work/:workId',
			params: {
				workName: null //no default value
			},			
            templateUrl: 'work-details.html',
			controller: 'workDetailsController',
			resolve:{
				work: ['$stateParams', function($stateParams){ //returns filtered work array by workId
					return work.filter(function(work){
						return work.workId == $stateParams.workId;
					});	
				}]
			},
			ncyBreadcrumb: {
				label: '{{workName}}',
				parent: 'work'
		    }			
        })
        
}]);