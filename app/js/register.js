var register = angular.module('register',['services']);

register.controller('register', function($scope, Events) {
	$scope.registerEvent = function(){
        console.log($scope.email + " " + $scope.password);
        var error = $scope.validateEmail($scope.email);
        console.log(error);
	};
	$scope.validateEmail = function(email){
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	};
});
