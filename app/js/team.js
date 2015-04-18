var team = angular.module('team',['ngRoute', 'services']);

team.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html#/teams", label: "My Teams"},
        {url: "league.html", label: "My Leagues"}
    ];
});

team.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/team', {
            templateUrl: '../partials/teams.html',
            controller: 'teams'
        }).
        when('/team/create', {
            templateUrl: '../partials/teamedit.html',
            controller: 'teamedit'
        }).
        when('/team/:teamId', {
            templateUrl: '../partials/teamview.html',
            controller: 'teamview'
        }).
        when('/team/:teamId/edit', {
            templateUrl: '../partials/teamedit.html',
            controller: 'teamedit'
        }).
        when('/team/:teamId/delete', {
            templateUrl: '../partials/teamdelete.html',
            controller: 'teamdelete'
        }).
        otherwise({
            redirectTo: '/team'
        });
}]);

team.controller('teams', function($scope, TeamEdit) {
    TeamEdit.get().$promise.then(function(resp) {
        $scope.teams = resp.teams;
        if($scope.teams.length == 0)
            $scope.teams = [{name:"No Teams"}];
        $("#successHeader").hide();
    });
});

team.controller('teamview', function($scope, Team, TeamStats, Color, TeamAddPlayer, TeamRemovePlayer, UserView, TeamPassing, $routeParams) {
    playerAutocomplete("#playerAdd", UserView);
    $(".colorpicker").colorpicker({history: false});

    $scope.saveColors = function(){
        var primaryColor = $('#primary').val();
        var secondaryColor = $('#secondary').val();
        var tertiaryColor = $('#tertiary').val();

        Color.save({id: $scope.teamSelected.id, primaryColor: primaryColor, secondaryColor: secondaryColor, tertiaryColor: tertiaryColor});

    };
    Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
        $scope.team = resp.team;
        $("#successHeader").hide();
        $scope.playerList = resp.team.players;
        $scope.isSoccer = ($scope.team.sport == 'SOCCER');

        TeamPassing.get({id: $routeParams.teamId}).$promise.then(function(resp) {
            var passing = resp.teamPasses.passes;
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

            angular.forEach($scope.playerList, function(player, key){
                if(players.indexOf(player.login) != -1) {
                    // based on number of passes, allow a name to be passes * 3
                    var count = 0;
                    passdata[players.indexOf(player.login)].map(function(d){count += d});
                    players[players.indexOf(player.login)] = player.lastName.slice(0, count > 1 ? count*3 : 1 );
                }
            });

            chordChart("#passChart", passdata, players, $("#passChart").parent().width(), 300);
        });
        TeamStats.get({id: $routeParams.teamId}).$promise.then(function(resp) {
            var stats = resp.teamStats;

            if($scope.isSoccer) {
                var fouldata = [{label: 'fouls', count: stats.fouls, color: "#ccc", highlightColor: "#eee"},
                    {label: 'yellows', count: stats.yellow, color: "#ffdd00", highlightColor: "#ffee00"},
                    {label: 'reds', count: stats.red, color: "#ff4444", highlightColor: "#ff8888"}];

                barChart("#foulChart", fouldata, $("#foulChart").parent().width()/1.5, 250);

                var goaldata = [{ "label": "For", "value": stats.goals, "color": "#44cc44"},
                {"label": "Against", "value": stats.goalsAgainst, "color": "#cc4444"}];

                pieChart("#goalChart", goaldata, $("#goalChart").parent().width(), 250);

                var shotdata = [{ "label": "Goal", "value": stats.goals, "color": "#44cc44"},
                {"label": "Saved", "value": stats.shotsOnGoal, "color": "#ffee00"},
                {"label": "Off Target", "value": (stats.shots - stats.shotsOnGoal), "color": "#cc4444"}];

                pieChart("#shotChart", shotdata, $("#goalChart").parent().width(), 250);
            } else {
                var goaldata = [{ "label": "For", "value": stats.pointsFor, "color": "#44cc44"},
                    {"label": "Against", "value": stats.pointsAgainst, "color": "#cc4444"}];

                pieChart("#ultimategoalChart", goaldata, $("#ultimategoalChart").parent().width(), 250);

                var fouldata = [{label: 'fouls', count: stats.fouls, color: "#ccc", highlightColor: "#eee"}];

                barChart("#ultimatefoulChart", fouldata, $("#ultimatefoulChart").parent().width()/4, 250);
            }
        });
    });

    $scope.addPlayer = function(){
        TeamAddPlayer.update({login: $scope.playerAdd, id: $scope.team.id}).$promise.then(function(resp) {
            $("#playerAdd")[0].selectize.clear();
            Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
                $scope.playerList = resp.team.players;
            });
        });
    };

    $scope.deleteTeam = function(login){
        TeamRemovePlayer.delete({login: login, id: $scope.team.id}).$promise.then(function(resp) {
            Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
                $scope.playerList = resp.team.players;
            });
        });
    };
});

team.controller('teamedit', ['$scope', 'Team', 'Sports', '$routeParams', function($scope, Team, Sports, $routeParams) {
    Sports.get().$promise.then(function(resp){
        $scope.sports = resp.sports;
        if($routeParams.teamId) {
            Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
                $scope.team = resp.team;
                $scope.teamName = resp.team.name;
                angular.forEach($scope.sports, function(sport, value){
                    if(sport.id == resp.team.sport)
                        $scope.sport = sport;
                });
            });
        }
    });
    $scope.submitEdit = function(id) {
        if(!angular.isUndefined($scope.team)) {
            Team.update({id: $scope.team.id, name: $scope.teamName, sport: $scope.sport.id}).$promise.then(function(){
                $("#successHeader").show().find("#successMessage").text("Saved Team Changes");
            });
        } else {
            Team.save({name: $scope.teamName, sport: $scope.sport.id}).$promise.then(function(){
                $("#successHeader").show().find("#successMessage").text("Saved Team Changes");
            });
        }
    };
}]);

team.controller('teamdelete', ['$scope', 'Team', '$routeParams', function($scope, Team, $routeParams) {
    Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
        $scope.team = resp.team;
    });
    $scope.deleteTeam = function() {
        Team.delete({id: $scope.team.id}).$promise.then(function(){
            $("#successHeader").show().find("#successMessage").text("Team is Deleted");
        });
    }
}]);
