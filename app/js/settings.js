var settings = angular.module('settings',['services']);

settings.controller('header', function($scope) {
});

settings.controller('settingsc', function($scope, User) {
    User.get({email:"stevendburnett@gmail.com"}).$promise.then(function(resp) {
        var events = resp.user;
        $scope.events = events.firstName;
      });
});
