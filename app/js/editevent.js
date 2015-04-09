var editevent = angular.module('editevent',['services']);

editevent.controller('header', function($scope) {
});

editevent.controller('editevent', function($scope, $location, UserView, TeamView, Event, EventStats, Team) {
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
    EventStats.get({id:$location.search().event}).$promise.then(function(resp) {
        $scope.eventstats = resp.eventStats;
        $scope.team1stats = $scope.eventstats.teamStats[0];
        $scope.team2stats = $scope.eventstats.teamStats[1];

        var team1fouldata = [{label: 'fouls', count: $scope.team1stats.fouls, color: "#ccc", highlightColor: "#eee"},
        {label: 'yellows', count: $scope.team1stats.yellow, color: "#ffdd00", highlightColor: "#ffee00"},
        {label: 'reds', count: $scope.team1stats.red, color: "#ff4444", highlightColor: "#ff8888"}];

        barChart("#team1foulChart", team1fouldata);

        var team1shotdata = [{ "label": "Goal", "value": $scope.team1stats.goals, "color": "#44cc44"},
            {"label": "Saved", "value": $scope.team1stats.shotsOnGoal, "color": "#ffee00"},
            {"label": "Off Target", "value": ($scope.team1stats.shots - $scope.team1stats.shotsOnGoal), "color": "#cc4444"}];

        pieChart("#team1shotChart", team1shotdata);

        var team2fouldata = [{label: 'fouls', count: $scope.team2stats.fouls, color: "#ccc", highlightColor: "#eee"},
        {label: 'yellows', count: $scope.team2stats.yellow, color: "#ffdd00", highlightColor: "#ffee00"},
        {label: 'reds', count: $scope.team2stats.red, color: "#ff4444", highlightColor: "#ff8888"}];

        barChart("#team2foulChart", team2fouldata);

        var team2shotdata = [{ "label": "Goal", "value": $scope.team2stats.goals, "color": "#44cc44"},
            {"label": "Saved", "value": $scope.team2stats.shotsOnGoal, "color": "#ffee00"},
            {"label": "Off Target", "value": ($scope.team2stats.shots - $scope.team2stats.shotsOnGoal), "color": "#cc4444"}];

        pieChart("#team2shotChart", team2shotdata);

        Team.get({id: $scope.team1stats.teamID}).$promise.then(function(resp) {
            $scope.team1 = resp.team;
        });
        Team.get({id: $scope.team2stats.teamID}).$promise.then(function(resp) {
            $scope.team2 = resp.team;
        });
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
