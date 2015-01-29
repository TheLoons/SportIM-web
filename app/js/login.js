var login = angular.module('login',['services', 'ngCookies'])
    .config(['$locationProvider',
        function ($locationProvider) {
            // note we do not require base as we are only using it to parse parameters
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }
    ]);

login.controller('login', function($scope, Login, $cookies, $location) {
    if($location.search().error) {
        if($location.search().error == "NotAuthorized") {
            $('#errorMessage').text("Please Sign in.");
            $('#errorMessage').css({'color': 'red'});
            $('#errorMessage').show(600);	
        }
    }

	$scope.loginEvent = function(){
		Login.save({login: $scope.email, password: $scope.password}).$promise.then(function(resp) {
			if (resp.status.code == 200) {
                $cookies.session = resp.token;
                window.location.href = "../views/home.html";
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
