var editevent = angular.module('editevent',['services']);

editevent.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html", label: "My Teams"},
        {url: "league.html", label: "My Leagues"}
    ];
});

editevent.controller('editevent', function($scope, $location, UserView, TeamView, Event, EventStats, Team, EventPassing) {
    $scope.loadPassing = function(teamID, passing, element) {
        Team.get({id: teamID}).$promise.then(function(resp) {
            var team = resp.team;
            var playerList = resp.team.players;
            var passdata = [];
            var players = [];

            angular.forEach(passing, function(pass, key){
                if(players.indexOf(pass.to) == -1) {
                    players.push(pass.to);
                    passdata[players.indexOf(pass.to)] = [];
                }

                if(players.indexOf(pass.from) == -1) {
                    players.push(pass.from);
                    passdata[players.indexOf(pass.from)] = [];
                }

                passdata[players.indexOf(pass.from)][players.indexOf(pass.to)] = pass.count;
            });

            angular.forEach(passdata, function(pass, key){
                for(i = 0; i < players.length; i++) {
                    if(pass[i] == undefined)
                        pass[i] = 0;
                }
            });

            angular.forEach(playerList, function(player, key){
                if(players.indexOf(player.login) != -1) {
                    // based on number of passes, allow a name to be passes * 3
                    var count = 0;
                    passdata[players.indexOf(player.login)].map(function(d){count += d});
                    players[players.indexOf(player.login)] = player.lastName.slice(0, count > 1 ? count*3 : 1 );
                }
            });

            chordChart(element, passdata, players, $(element).parent().width(), 300);
        });
    }

    Event.get({id:$location.search().event}).$promise.then(function(resp) {
        if(resp.event.tournamentID){
            $scope.tournamentID = resp.event.tournamentID
        }
        $scope.event = resp.event;
        var event = resp.event;
        $scope.title = event.title;
        $scope.startTime = moment(event.start).format("MM/DD/YYYY h:mm A");
        $scope.endTime = moment(event.end).format("MM/DD/YYYY h:mm A");
        if (event.teams && event.teams[0] && event.teams[1]) {
            $('#homeLabel').show()
            $('#awayLabel').show()
            $scope.team1 = event.teams[0];
            $scope.team2 = event.teams[1];
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

        EventPassing.get({id: event.id}).$promise.then(function(resp) {
            if(resp.eventPasses[0].teamID == $scope.team1.id) {
                $scope.loadPassing($scope.team1.id, resp.eventPasses[0].passes, "#team1passChart");
                $scope.loadPassing($scope.team2.id, resp.eventPasses[1].passes, "#team2passChart");
            } else {
                $scope.loadPassing($scope.team1.id, resp.eventPasses[1].passes, "#team1passChart");
                $scope.loadPassing($scope.team2.id, resp.eventPasses[0].passes, "#team2passChart");
            }
        });
    });
    EventStats.get({id:$location.search().event}).$promise.then(function(resp) {
        $scope.eventstats = resp.eventStats;
        $scope.team1stats = $scope.eventstats.teamStats[0];
        $scope.team2stats = $scope.eventstats.teamStats[1];

        var team1fouldata = [{label: 'fouls', count: $scope.team1stats.fouls, color: "#ccc", highlightColor: "#eee"},
        {label: 'yellows', count: $scope.team1stats.yellow, color: "#ffdd00", highlightColor: "#ffee00"},
        {label: 'reds', count: $scope.team1stats.red, color: "#ff4444", highlightColor: "#ff8888"}];

        barChart("#team1foulChart", team1fouldata, 200, 150);

        var team1shotdata = [{ "label": "Goal", "value": $scope.team1stats.goals, "color": "#44cc44"},
            {"label": "Saved", "value": $scope.team1stats.shotsOnGoal, "color": "#ffee00"},
            {"label": "Off Target", "value": ($scope.team1stats.shots - $scope.team1stats.shotsOnGoal), "color": "#cc4444"}];

        pieChart("#team1shotChart", team1shotdata, 300, 250);

        var team2fouldata = [{label: 'fouls', count: $scope.team2stats.fouls, color: "#ccc", highlightColor: "#eee"},
        {label: 'yellows', count: $scope.team2stats.yellow, color: "#ffdd00", highlightColor: "#ffee00"},
        {label: 'reds', count: $scope.team2stats.red, color: "#ff4444", highlightColor: "#ff8888"}];

        barChart("#team2foulChart", team2fouldata, 200, 150);

        var team2shotdata = [{ "label": "Goal", "value": $scope.team2stats.goals, "color": "#44cc44"},
            {"label": "Saved", "value": $scope.team2stats.shotsOnGoal, "color": "#ffee00"},
            {"label": "Off Target", "value": ($scope.team2stats.shots - $scope.team2stats.shotsOnGoal), "color": "#cc4444"}];

        pieChart("#team2shotChart", team2shotdata, 300, 250);
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
    $scope.clearStats = function() {
        EventStats.delete({id:$scope.event.id}).$promise.then(function(resp) {
            location.reload();
        });
    };
});
