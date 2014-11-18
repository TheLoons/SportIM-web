var testapp = angular.module('testapp',['service']);

testapp.controller('home', function($scope, User) {
    $scope.colors = ["blue","red","green"];
    $scope.users = User.users();
});
