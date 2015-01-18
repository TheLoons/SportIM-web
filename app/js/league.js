var league = angular.module('league',['ngRoute', 'services']);

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

league.controller('leagues', function($scope, league) {
    $scope.leagues = [{"id": 3, "name": "test1", "owner":"jeff"},{"name":"test2","owner":"jeff"},{"name": "test1", "owner":"jeff"},{"name":"test2","owner":"jeff"}];
    league.get().$promise.then(function(resp) {
        $scope.leagues = resp;
    });
});

league.controller('leagueview', ['$scope', 'league', '$routeParams', function($scope, league, $routeParams) {
    league.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
        $scope.league = resp.league;
    });
}]);

league.controller('leagueedit', ['$scope', 'league', '$routeParams', function($scope, league, $routeParams) {
    if($routeParams.leagueId) {
        league.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
            $scope.league = resp.league;
            $scope.leagueName = resp.league.name;
            $scope.leagueOwner = resp.league.owner;
        });
    }
    $scope.submitEdit = function(id) {
        if(!angular.isUndefined($scope.league)) {
            league.update({id: $scope.league.id, name: $scope.leagueName, owner: $scope.leagueOwner});
        } else {
            league.save({name: $scope.leagueName, owner: $scope.leagueOwner});
        }
    };
}]);

league.controller('leaguedelete', ['$scope', 'league', '$routeParams', function($scope, league, $routeParams) {
    league.get({id: $routeParams.leagueId}).$promise.then(function(resp) {
        $scope.league = resp.league;
    });
    $scope.deleteleague = function() {
        league.delete({id: $scope.league.id});
    }
}]);
