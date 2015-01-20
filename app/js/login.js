var login = angular.module('login',['services']);

login.controller('login', function($scope, Login) {
	$scope.loginEvent = function(){
		Login.save({login: $scope.email, password: $scope.password}).$promise.then(function(resp) {
			if (resp.status.code == 200) {
				console.log(resp.token);	
			}
			else if (resp.status.code == 401) 
			{
				console.log("login information wrong");
			}
			else
			{
				console.log("can't login at this time");
			}
        	
    	});
	};
});
