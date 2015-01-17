var login = angular.module('login',['services']);

login.controller('login', function($scope, Events) {
	$scope.loginEvent = function(){
        console.log($scope.email + " " + $scope.password);
	};
});
