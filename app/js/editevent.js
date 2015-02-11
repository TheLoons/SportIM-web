var editevent = angular.module('editevent',['services'])
.config(['$locationProvider',
        function ($locationProvider) {
            // note we do not require base as we are only using it to parse parameters
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }
    ]);

editevent.controller('header', function($scope) {
});

editevent.controller('editevent', function($scope, $location, UserView, TeamView, Event) {
    Event.get({id:$location.search().event}).$promise.then(function(resp) {

        var event = resp.event;
        if event.owner != you
        $scope.title = event.title;
      });
    UserView.get().$promise.then(function(resp) {
        var people = resp.users;
        $scope.searchUsers = people;

        $scope.firstName = people[0].firstName;

    });
    TeamView.get().$promise.then(function(resp) {
        var teams = resp.teams;
        $scope.searchTeams = teams;    
    });
});
