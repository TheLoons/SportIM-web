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
        $scope.title = event.title;
        $scope.startTime = event.start;
        $scope.endTime = event.end;
        if (event.teams && event.teams[0] && event.teams[1]) {
            $('#homeTeam').show()
            $('#awayTeam').show()
            $('#homeLabel').show()
            $('#awayLabel').show()
            $scope.homeTeam = event.teams[0].id;
            $scope.awayTeam = event.teams[1].id;
        }
        if (!event.editable) {
            $("#homeTeam").prop("readonly",true);
            $("#awayTeam").prop("readonly",true);
            $("#title").prop("readonly",true);
            $("#description").prop("readonly",true);
            $("#startTime").prop("readonly",true);
            $("#endTime").prop("readonly",true);
            $("#submit").hide();
        }
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
