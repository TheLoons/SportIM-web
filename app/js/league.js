var league = angular.module('league',['ngRoute', 'services']);

league.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html", label: "My Teams"},
        {url: "league.html#/leagues", label: "My Leagues"}
    ];
});

league.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/league', {
            templateUrl: '../partials/leagues.html',
            controller: 'leagues'
        }).
        when('/league/create', {
            templateUrl: '../partials/leagueedit.html',
            controller: 'leagueedit'
        }).
        when('/league/:leagueId', {
            templateUrl: '../partials/leagueview.html',
            controller: 'leagueview'
        }).
        when('/league/:leagueId/edit', {
            templateUrl: '../partials/leagueedit.html',
            controller: 'leagueedit'
        }).
        when('/league/:leagueId/delete', {
            templateUrl: '../partials/leaguedelete.html',
            controller: 'leaguedelete'
        }).
        otherwise({
            redirectTo: '/league'
        });
}]);

league.controller('leagues', function($scope, League) {
    League.get().$promise.then(function(resp) {
        $scope.leagues = resp.leagues;
        if($scope.leagues.length == 0)
            $scope.leagues = [{name:"No Leagues"}];
        $("#successHeader").hide();
    });
});

league.controller('leagueview', function($scope, League, LeagueTeamAdd, LeagueTables, LeagueTableResult, LeagueTeamRemove, TeamEdit, TeamView, $routeParams) {
    teamAutocomplete("#teamAdd", TeamEdit);
    League.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
        $scope.league = resp.league;
        $scope.teamList = resp.league.teams;
        $("#successHeader").hide();

        LeagueTables.get({id: $routeParams.leagueId}).$promise.then(function(resp){
            $scope.tableList = resp.tables;
        });
    });
    $scope.changeTournament = function() {
        TeamView.get().$promise.then(function(resp) {
            if(resp.status.code == 200) {
                var teamviews = resp.teams
                LeagueTableResult.get({id: $routeParams.leagueId, tableID: $scope.leagueSelected.tournamentId}).$promise.then(function(resp){
                    var table = resp.tournamentResults;

                    angular.forEach(table, function(teamResults, key){
                        angular.forEach(teamviews, function(team, key){
                            if(teamResults.teamID == team.id)
                                teamResults.name = team.name;
                        });
                    });

                    $scope.tournamentResults = table;
                });
            }
        });
    }
    $scope.addTeam = function(){
        LeagueTeamAdd.update({teamId: parseInt($scope.teamAdd), id: $scope.league.id}).$promise.then(function(resp) {
            $("#teamAdd")[0].selectize.clear();
            League.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
                $scope.teamList = resp.league.teams;
            });
        });
    };
    $scope.deleteTeam = function(teamId){
        LeagueTeamRemove.delete({teamId: teamId, id: $scope.league.id}).$promise.then(function(resp) {
            League.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
                $scope.teamList = resp.league.teams;
            });
        });
    };
});

league.controller('leagueedit', ['$scope', 'League', 'Sports', '$routeParams', function($scope, League, Sports, $routeParams) {
    Sports.get().$promise.then(function(resp){
        $scope.sports = resp.sports;
        if($routeParams.leagueId) {
            League.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
                $scope.league = resp.league;
                $scope.leagueName = resp.league.name;
                angular.forEach($scope.sports, function(sport, value){
                    if(sport.id == resp.league.sport)
                        $scope.sport = sport;
                });
            });
        }
    });
    $scope.submitEdit = function(id) {
        if(!angular.isUndefined($scope.league)) {
            League.update({id: $scope.league.id, name: $scope.leagueName, sport: $scope.sport.id}).$promise.then(function(){
                $("#successHeader").show().find("#successMessage").text("Saved League Changes");
            });
        } else {
            League.save({name: $scope.leagueName, sport: $scope.sport.id}).$promise.then(function(){
                $("#successHeader").show().find("#successMessage").text("Saved League Changes");
            });
        }
    };
}]);

league.controller('leaguedelete', ['$scope', 'League', '$routeParams', function($scope, League, $routeParams) {
    League.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
        $scope.league = resp.league;
    });
    $scope.deleteleague = function() {
        League.delete({id: $scope.league.id}).$promise.then(function(){
            $("#successHeader").show().find("#successMessage").text("League is Deleted");
        });
    }
}]);
