var editevent = angular.module('editevent',['services']);

editevent.controller('header', function($scope) {
});

editevent.controller('editevent', function($scope, $location, UserView, TeamView, Event) {
    Event.get({id:$location.search().event}).$promise.then(function(resp) {
        $scope.event = resp.event;
        var event = resp.event;
        $scope.title = event.title;
        $scope.startTime = event.start;
        $scope.endTime = event.end;
        if (event.teams && event.teams[0] && event.teams[1]) {
            $('#homeLabel').show()
            $('#awayLabel').show()
            $("#homeTeam").val(event.teams[0].name);
            $("#awayTeam").val(event.teams[1].name);
            teamAutocomplete("#homeTeam", TeamView);
            teamAutocomplete("#awayTeam", TeamView);
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
    $scope.submitEvent = function() {
        Event.update({id:$scope.event.id, owner: $scope.event.owner, type: $scope.eventType, location: $scope.location , title:"blah", start: $scope.startTime, end: $scope.endTime, description:$scope.eventDescription}).$promise.then(function(resp) {
            if(resp.status){
                $("#successMessage").text("Update Successful");
            }
        });
    };
});
