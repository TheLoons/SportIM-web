var settings = angular.module('settings',['services']);

settings.controller('header', function($scope) {
});

settings.controller('settingsc', function($scope, User) {
    User.get({email:"stevendburnett@gmail.com"}).$promise.then(function(resp) {
        var user = resp.user;
        $scope.firstName = user.firstName;
        $scope.lastName = user.lastName;
        $scope.phonenumber = user.phone;
        $scope.email = user.login;
      });
    $scope.submitEvent = function(){
    };
});
