var login = angular.module('login',['services']);

login.controller('login', function($scope, Login) {
	$scope.loginEvent = function(){
		Login.save({login: $scope.email, password: $scope.password}).$promise.then(function(resp) {
			if (resp.status.code == 200) {
				console.log(resp.token);	
			}
			else if (resp.status.code == 401) 
			{
				$('#email').css({'border': '1px solid rgba(255,0,0,0.6)'});
				$('#password').css({'border': '1px solid rgba(255,0,0,0.6)'});
				$('#errorMessage').show(600, $scope.callBack());
			}
			else
			{
				$('#errorMessage').text("Server is unavailable at this time.");
				$('#errorMessage').css({'color': 'red'});
				$('#errorMessage').show(600, $scope.callBack());	
			}
        	
    	});
    	$scope.callBack = function(){
    	};
	};
});
