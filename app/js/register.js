var register = angular.module('register',['services']);

register.controller('register', function($scope, Register) {
	$scope.registerEvent = function(){
        console.log($scope.email + " " + $scope.password);
        var error = $scope.validateEmail($scope.email);
        Register.save({login: $scope.email, firstName: $scope.firstName, lastName: $scope.lastName, phone: $scope.phone, password: $scope.password});
	};
	$scope.validateEmail = function(email){
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	};
});
