var mainApp = angular.module("mainApp", ['ui.bootstrap','ui.router','ncy-angular-breadcrumb','LocalStorageModule','ui.bootstrap.showErrors', 'ngMessages', 'ngAnimate']);

//local storage
mainApp.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('mainApp')
    .setStorageType('sessionStorage')
    .setNotify(true, true)
});

//configure success for shoeErrors directive globally
mainApp.config(['showErrorsConfigProvider', function(showErrorsConfigProvider) {
  showErrorsConfigProvider.showSuccess(true);
}]);