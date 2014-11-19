var home = angular.module('home',['services']);

home.controller('colors', function($scope) {
    $scope.colors = ["blue","red","green"];
});
home.controller('users', function($scope, User) {
    $scope.users = User.users();
});
