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

league.controller('leagueview', ['$scope', 'League', 'LeagueTeamAdd', '$routeParams', function($scope, League, LeagueTeamAdd, $routeParams) {
    League.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
        $scope.league = resp.league;
        $scope.teamList = resp.league.teams;
        $("#successHeader").hide();
    });
    $scope.addTeam = function(){
        LeagueTeamAdd.save({teamId: parseInt($scope.teamAdd), id: $scope.league.id});
    };
}]);

league.controller('leagueedit', ['$scope', 'League', '$routeParams', function($scope, League, $routeParams) {
    if($routeParams.leagueId) {
        League.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
            $scope.league = resp.league;
            $scope.leagueName = resp.league.name;
            $scope.sport = resp.league.sport;
        });
    }
    $scope.submitEdit = function(id) {
        if(!angular.isUndefined($scope.league)) {
            League.update({id: $scope.league.id, name: $scope.leagueName, sport: $scope.sport}).$promise.then(function(){
                $("#successHeader").show().find("#successMessage").text("Saved League Changes");
            });
        } else {
            League.save({name: $scope.leagueName, sport: $scope.sport}).$promise.then(function(){
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
