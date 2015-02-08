var team = angular.module('team',['ngRoute', 'services']);

team.controller('header', function($scope) {
    $scope.contextItems = [
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

team.controller('teams', function($scope, Team) {
    Team.get().$promise.then(function(resp) {
        $scope.teams = resp.teams;
        if($scope.teams.length == 0)
            $scope.teams = [{name:"No Teams"}];
    });
});

team.controller('teamview', ['$scope', 'Team', '$routeParams', function($scope, Team, $routeParams) {
    Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
        $scope.team = resp.team;
    });
}]);

team.controller('teamedit', ['$scope', 'Team', '$routeParams', function($scope, Team, $routeParams) {
    if($routeParams.teamId) {
        Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
            $scope.team = resp.team;
            $scope.teamName = resp.team.name;
            $scope.teamOwner = resp.team.owner;
        });
    }
    $scope.submitEdit = function(id) {
        if(!angular.isUndefined($scope.team)) {
            Team.update({id: $scope.team.id, name: $scope.teamName, owner: $scope.teamOwner});
        } else {
            Team.save({name: $scope.teamName, owner: $scope.teamOwner});
        }
    };
}]);

team.controller('teamdelete', ['$scope', 'Team', '$routeParams', function($scope, Team, $routeParams) {
    Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
        $scope.team = resp.team;
    });
    $scope.deleteTeam = function() {
        Team.delete({id: $scope.team.id});
    }
}]);
