var register = angular.module('register',['services', 'ngCookies']);

register.controller('register', function($scope, Register, Login, $cookies) {
	$scope.registerEvent = function(){
		var missingFields = false;
		if (!$scope.lastName) {
			$('#lastName').css({'border': '1px solid rgba(255,0,0,0.6)'});
			missingFields = true;
		}
		if (!$scope.email) {
			$('#email').css({'border': '1px solid rgba(255,0,0,0.6)'});
			missingFields = true;
		}
		if (!$scope.phone) {
			$('#phone').css({'border': '1px solid rgba(255,0,0,0.6)'});
			missingFields = true;
		}
		if (!$scope.password) {
			$('#password').css({'border': '1px solid rgba(255,0,0,0.6)'});
			missingFields = true;
		}
		if (!$scope.firstName) {
			$('#firstName').css({'border': '1px solid rgba(255,0,0,0.6)'});
			missingFields = true;
		}
		if (missingFields) {
			$('#errorMessage').text("Fill in missing fields");
        	$('#errorMessage').css({'color': 'red'});
        	$('#errorMessage').show(600, $scope.callBack());
        	return;
		};
        if (!$scope.validateEmail($scope.email)) {
        	$('#errorMessage').text("Invalid email address.");
        	$('#errorMessage').css({'color': 'red'});
        	$('#email').css({'border': '1px solid rgba(255,0,0,0.6)'});
        	$('#errorMessage').show(600, $scope.callBack());
        	return;
        };
        Register.save({login: $scope.email, firstName: $scope.firstName, lastName: $scope.lastName, phone: $scope.phone, password: $scope.password}).$promise.then(function(resp) {
            if (resp.status.code == 200) {
                Login.save({login: $scope.email, password: $scope.password}).$promise.then(function(resp) {
                    if (resp.status.code == 200) {
                        $cookies.session = resp.token;
                        window.location.href = "../views/home.html";
                    }
                });
            }
            else{
                $('#errorMessage').text("Server error please try again later");
				$('#errorMessage').css({'color': 'red'});
				$('#errorMessage').show(600, $scope.callBack());
			}	
        });
	};
	$scope.validateEmail = function(email){
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	};
	$scope.callBack = function(){
    };
});
