mainApp.factory('alertService', function() {
   var alertService  = {alerts:[]};
   //could also pollute the rootscope but considered bad practice to do so
   
   alertService.addAlert = function(type, msg) {
      alertService.alerts.push({'type': type, 'msg': msg});
   }
   
   alertService.closeAlert = function(index) {
	  alertService.alerts.splice(index,1);
   }   
   
   alertService.clear = function(index) {
	  alertService.alerts = [];
   }      
   
   return alertService;
}); 