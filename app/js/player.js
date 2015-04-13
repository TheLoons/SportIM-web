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

player.controller('playerview', function($scope, User, PlayerStats, PlayerPassing, $routeParams) {
    User.get({login: $routeParams.playerId}).$promise.then(function(resp) {
        $scope.player = resp.user;
        $("#successHeader").hide();

        PlayerPassing.get({login: $routeParams.playerId}).$promise.then(function(resp) {
            var passingMade = resp.playerPasses.passesMade;
            var passingReceived = resp.playerPasses.passesReceived;
            var passdata = [];
            var players = [];

            players.push($scope.player.login);
            passdata[players.indexOf($scope.player.login)] = [];

            angular.forEach(passingMade, function(count, to){
                if(players.indexOf(to) == -1) {
                    players.push(to);
                    passdata[players.indexOf(to)] = [];
                }

                passdata[players.indexOf($scope.player.login)][players.indexOf(to)] = count;
            });

            angular.forEach(passingReceived, function(count, from){
                if(players.indexOf(from) == -1) {
                    players.push(from);
                    passdata[players.indexOf(from)] = [];
                }

                passdata[players.indexOf(from)][players.indexOf($scope.player.login)] = count;
            });

            angular.forEach(passdata, function(pass, key){
                for(i = 0; i < players.length; i++) {
                    if(pass[i] == undefined)
                        pass[i] = 0;
                }
            });

            var namecount = 0;
            angular.forEach(players, function(player, key){
                User.get({login: player}).$promise.then(function(resp) {
                    // based on number of passes, allow a name to be passes * 3
                    var count = 0;
                    passdata[key].map(function(d){count += d});
                    players[key] = resp.user.lastName.slice(0, count > 1 ? count*3 : 1 );
                    namecount++;
                    if(namecount == players.length)
                        chordChart("#passChart", passdata, players, $("#passChart").parent().width(), 300);
                });
            });
        });
    });
    PlayerStats.get({login: $routeParams.playerId}).$promise.then(function(resp) {
        var stats = resp.playerStats[0];

        var fouldata = [{label: 'fouls', count: stats.fouls, color: "#ccc", highlightColor: "#eee"},
        {label: 'yellows', count: stats.yellow, color: "#ffdd00", highlightColor: "#ffee00"},
        {label: 'reds', count: stats.red, color: "#ff4444", highlightColor: "#ff8888"}];

        barChart("#foulChart", fouldata, 200, 200);

        var goaldata = [{label: "Minutes", count: stats.minutes, color: "#ccc", highlightColor: "#eee"},
            {label: "Goals", count: stats.goals, color: "#44cc44", highlightColor: "#44ff44"}];

        barChart("#goalChart", goaldata, 200, 200);

        var shotdata = [{ "label": "Goal", "value": stats.goals, "color": "#44cc44"},
            {"label": "Saved", "value": stats.shotsOnGoal, "color": "#ffee00"},
            {"label": "Off Target", "value": (stats.shots - stats.shotsOnGoal), "color": "#cc4444"}];

        pieChart("#shotChart", shotdata, 300, 250);
    });
});

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
