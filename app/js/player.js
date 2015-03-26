var player = angular.module('player',['ngRoute', 'services']);

player.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html#/teams", label: "My Teams"},
        {url: "league.html", label: "My Leagues"}
    ];
});

player.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/player', {
            templateUrl: '../partials/players.html',
            controller: 'players'
        }).
        when('/player/create', {
            templateUrl: '../partials/playeredit.html',
            controller: 'playeredit'
        }).
        when('/player/:playerId', {
            templateUrl: '../partials/playerview.html',
            controller: 'playerview'
        }).
        when('/player/:playerId/edit', {
            templateUrl: '../partials/playeredit.html',
            controller: 'playeredit'
        }).
        when('/player/:playerId/delete', {
            templateUrl: '../partials/playerdelete.html',
            controller: 'playerdelete'
        }).
        otherwise({
            redirectTo: '/player'
        });
}]);

player.controller('players', function($scope, UserView) {
    UserView.get().$promise.then(function(resp) {
        $scope.players = resp.users;
        if($scope.players.length == 0)
            $scope.players = [{name:"No players"}];
        $("#successHeader").hide();
    });
});

player.controller('playerview', ['$scope', 'User', 'PlayerStats', '$routeParams', function($scope, User, PlayerStats, $routeParams) {
    User.get({login: $routeParams.playerId}).$promise.then(function(resp) {
        $scope.player = resp.user;
        $("#successHeader").hide();
    });
    PlayerStats.get({login: $routeParams.playerId}).$promise.then(function(resp) {
        var stats = resp.playerStats;

        var fouldata = [{label: 'fouls', count: stats.fouls, color: "#ccc", highlightColor: "#eee"},
        {label: 'yellows', count: stats.yellow, color: "#ffdd00", highlightColor: "#ffee00"},
        {label: 'reds', count: stats.red, color: "#ff4444", highlightColor: "#ff8888"}];

        barChart("#foulChart", fouldata);

        var goaldata = [{label: "Minutes", count: stats.minutes, color: "#ccc", highlightColor: "#eee"},
            {label: "Goals", count: stats.goals, color: "#44cc44", highlightColor: "#44ff44"}];

        barChart("#goalChart", goaldata);

        var shotdata = [{ "label": "Goal", "value": stats.goals, "color": "#44cc44"},
            {"label": "Saved", "value": stats.shotsOnGoal, "color": "#ffee00"},
            {"label": "Off Target", "value": (stats.shots - stats.shotsOnGoal), "color": "#cc4444"}];

        pieChart("#shotChart", shotdata);
    });
}]);

player.controller('playeredit', ['$scope', 'User', '$routeParams', function($scope, User, $routeParams) {
    if($routeParams.playerId) {
        User.get({login: $routeParams.playerId}).$promise.then(function(resp) {
            $scope.player = resp.user;
            $scope.playerFirstName = resp.user.firstName;
            $scope.playerLastName = resp.user.lastName;
            $scope.playerEmail = resp.user.login;
            $scope.playerPhone = resp.user.phone;
        });
    }
    $scope.submitEdit = function(id) {
        if(!angular.isUndefined($scope.player)) {
            User.update({login: $scope.playerEmail, firstName: $scope.playerFirstName, lastName: $scope.playerLastName, phone: $scope.playerPhone}).$promise.then(function(){
                $("#successHeader").show().find("#successMessage").text("Saved Player Changes");
            });
        } else {
            User.save({login: $scope.playerEmail, firstName: $scope.playerFirstName, lastName: $scope.playerLastName, phone: $scope.playerPhone}).$promise.then(function(){
                $("#successHeader").show().find("#successMessage").text("Saved Player Changes");
            });
        }
    };
}]);

player.controller('playerdelete', ['$scope', 'User', '$routeParams', function($scope, User, $routeParams) {
    User.get({login: $routeParams.playerId}).$promise.then(function(resp) {
        $scope.player = resp.user;
    });
    $scope.deleteplayer = function() {
        User.delete({id: $scope.player.login}).$promise.then(function(){
            $("#successHeader").show().find("#successMessage").text("Player is Deleted");
        });
    }
}]);
