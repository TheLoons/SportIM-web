var calendar = angular.module('stattracker',['services', 'timer', 'ngCookies'])
    .config(['$locationProvider',
        function ($locationProvider) {
            // note we do not require base as we are only using it to parse parameters
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }
    ]);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('stattrackerc', function($scope, Team, Event, Session, SessionReset, Foul, $cookies, $location) {
    $scope.bindPlayers = function(){
        $(".player").draggable();

        $(".player").click(function(evt) {
            var modaltop = $(this).offset().top - $("#player-modal").height() - 20;
            var modalleft = $(this).offset().left - ($("#player-modal").width() / 3) + 10;
            $("#player-modal").css({top: modaltop, left: modalleft, display: 'inherit'});
            evt.stopPropagation();
        });
    };

    if($location.search().event) {
        Event.get({id: $location.search().event}).$promise.then(function(resp) {
            $scope.event = resp.event;

            Team.get({id: $scope.event.teams[0].id}).$promise.then(function(resp) {
                $scope.team1 = resp.team;
                setTimeout(function(){$scope.bindPlayers()}, 500);
            });

            Team.get({id: $scope.event.teams[1].id}).$promise.then(function(resp) {
                $scope.team2 = resp.team;
                setTimeout(function(){$scope.bindPlayers()}, 500);
            });
        });
    }

    $scope.startSession = function(){
        Session.get({id: $scope.event.id}).$promise.then(function(resp) {
            //check for session conflict
            if(resp.status.code == 409) {
                SessionReset.get({id: $scope.event.id}).$promise.then(function(resp) {
                    $cookies.soccersession = resp.token;
                    $scope.$broadcast('timer-start');
                });
            } else {
                $cookies.soccersession = resp.token;
                $scope.$broadcast('timer-start');
            }
        });
    };

    $scope.stopSession = function(){
        $scope.$broadcast('timer-stop');
        console.log($("#timer").text());
    };

    $scope.timerRunning = false;

    $scope.toggleTimer = function() {
        if(!$scope.timerRunning)
            $scope.startSession();
        else
            $scope.stopSession();

        $scope.timerRunning = !$scope.timerRunning;
    };

    $scope.foul = function(){
        Foul.get({id: $scope.event.id}).$promise.then(function(resp) {
            setTimeout(function(){$(".player").draggable();}, 500);
        });
    };

    $(".soccerball").draggable();

    $(document).click(function() {
        $("#player-modal").css('display', 'none');
    });
});
