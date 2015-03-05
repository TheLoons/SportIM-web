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

team.controller('teams', function($scope, TeamEdit) {
    TeamEdit.get().$promise.then(function(resp) {
        $scope.teams = resp.teams;
        if($scope.teams.length == 0)
            $scope.teams = [{name:"No Teams"}];
        $("#successHeader").hide();
    });
});

team.controller('teamview', ['$scope', 'Team', 'TeamStats', '$routeParams', function($scope, Team, TeamStats, $routeParams) {
    Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
        $scope.team = resp.team;
        $("#successHeader").hide();
    });
    TeamStats.get({id: $routeParams.teamId}).$promise.then(function(resp) {
        var stats = resp.teamStats;
        var data = [{label: 'fouls', count: stats.fouls, color: "#ccc"},
        {label: 'yellows', count: stats.yellow, color: "#"},
        {label: 'reds', count: stats.red}];
        console.log(data.length);

        var barWidth = 50;
        var width = (barWidth + 10) * data.length;
        var height = 200;

        var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
        var y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return datum.count; })]).
            rangeRound([0, height]);

        // add the canvas to the DOM
        var barDemo = d3.select("#foulChart").
            attr("width", width).
            attr("height", height);

        barDemo.selectAll("rect").
            data(data).
            enter().
            append("svg:rect").
            attr("x", function(datum, index) { return x(index); }).
            attr("y", function(datum) { return height - y(datum.count) - 30; }).
            attr("height", function(datum) { return y(datum.count); }).
            attr("width", barWidth).
            attr("fill", function(datum) { return y(datum.color); });

        barDemo.selectAll("text").
            data(data).
            enter().
            append("text").
            attr("x", function(datum, index) { return x(index); }).
            attr("y", function(datum) { return height - 20; }).
            attr("dy", ".75em").
            attr("text-anchor", "middle").
            text(function(datum) {return datum.label});
    });
}]);

team.controller('teamedit', ['$scope', 'Team', '$routeParams', function($scope, Team, $routeParams) {
    if($routeParams.teamId) {
        Team.get({id: $routeParams.teamId}).$promise.then(function(resp) {
            $scope.team = resp.team;
            $scope.teamName = resp.team.name;
            $scope.sport = resp.team.sport;
        });
    }
    $scope.submitEdit = function(id) {
        if(!angular.isUndefined($scope.team)) {
            Team.update({id: $scope.team.id, name: $scope.teamName, sport: $scope.sport}).$promise.then(function(){
                $("#successHeader").show().find("#successMessage").text("Saved Team Changes");
            });
        } else {
            Team.save({name: $scope.teamName, sport: $scope.sport}).$promise.then(function(){
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
