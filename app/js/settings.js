var settings = angular.module('settings',['services']);

settings.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html", label: "My Teams"},
        {url: "league.html", label: "My Leagues"}
    ];
});

settings.controller('settingsc', function($scope, UserAlert) {
    UserAlert.get().$promise.then(function(resp) {
        var user = resp.user;
        $scope.firstName = user.firstName;
        $scope.lastName = user.lastName;
        $scope.phonenumber = user.phone;
        $scope.email = user.login;
        $scope.gameAlert = user.gameAlert;
        $scope.practiceAlert = user.practiceAlert;
        $scope.meetingAlert = user.meetingAlert;
        $scope.otherAlert = user.otherAlert;
      });
    $scope.submitEvent = function(){
    	UserAlert.update({firstName: $scope.firstName, lastName: $scope.lastName, phone: $scope.phonenumber, email: $scope.email, gameAlert: $scope.gameAlert, practiceAlert: $scope.practiceAlert, meetingAlert: $scope.meetingAlert, otherAlert: $scope.otherAlert});
    };
});
