var calendar = angular.module('stattracker',['services', 'timer', 'ngCookies']);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('stattrackerc', function($scope, Team, Event, Session, SessionReset, Foul, $cookies, $location) {
    $(".soccer-field").height(function(){
        return $(this).width()*(1530/2048);
    });

    $(window).resize(function() {
        $(".soccer-field").height(function(){
            return $(this).width()*(1530/2048);
        });
    });

    $scope.bindPlayers = function(){
        $(".player").draggable();
    };

    $scope.playerClick = function(evt, player, team){
        $scope.currentPlayer = player;
        $scope.currentTeam = team;
        var modaltop = $(evt.currentTarget).offset().top - $("#player-modal").height() - 20;
        var modalleft = $(evt.currentTarget).offset().left - ($("#player-modal").width() / 3) + 10;
        $("#player-modal").css({top: modaltop, left: modalleft, display: 'inherit'});
        evt.stopPropagation();
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
                $("#errorHeader").hide();
                $("#resetHeader").show();
            } else {
                $cookies.soccersession = resp.session;
                $scope.$broadcast('timer-start');
            }
        });
    };

    $scope.resetSession = function(){
        $("#resetHeader").hide();
        SessionReset.get({id: $scope.event.id}).$promise.then(function(resp) {
            $cookies.soccersession = resp.session;
            $scope.$broadcast('timer-start');
        });
    };

    $scope.hideResetHeader = function(){
        $("#resetHeader").hide();
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

    $scope.foul = function(type){
        if(type == 'red')
            var parameters = {id: $scope.event.id, player: $scope.currentPlayer, teamID: $scope.currentTeam, red: 'true'};
        else if(type == 'yellow')
            var parameters = {id: $scope.event.id, player: $scope.currentPlayer, teamID: $scope.currentTeam, yellow: 'true'};
        else
            var parameters = {id: $scope.event.id, player: $scope.currentPlayer, teamID: $scope.currentTeam};

        Foul.save(parameters).$promise.then(function(resp) {
            setTimeout(function(){$(".player").draggable();}, 500);
        });
    };

    $(".soccerball").draggable({
        start: function(event, ui) {
            $(".goal-area").css("background-color", "#00cc00");
            $(".corner-area").css("background-color", "#0000cc");
        },
        stop: function(event, ui) {
            $(".goal-area").css("background-color", "transparent");
            $(".corner-area").css("background-color", "transparent");
        }
    });
    $(".goal-area").droppable({
        accept: ".soccerball",
        drop: function(event, ui) {
        },
        over: function(event, ui) {
            $(this).css("background-color", "#00ff00");
        },
        out: function(event, ui) {
            $(this).css("background-color", "#00cc00");
        }
    });
    $(".corner-area").droppable({
        accept: ".soccerball",
        drop: function(event, ui) {
        },
        over: function(event, ui) {
            $(this).css("background-color", "#0000ff");
        },
        out: function(event, ui) {
            $(this).css("background-color", "#0000cc");
        }
    });

    $(document).click(function() {
        $("#player-modal").css('display', 'none');
    });
});
