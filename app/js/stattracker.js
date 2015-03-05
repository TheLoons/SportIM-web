var calendar = angular.module('stattracker',['services', 'timer', 'ngCookies']);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('stattrackerc', function($scope, Team, Event, Session, SessionReset, Foul, Shot, Goal, $cookies, $location) {
    $scope.score1 = 0;
    $scope.score2 = 0;

    $(".soccer-field").height(function(){
        return $(this).width()*(1530/2048);
    });

    $(".middle-area").width(function(){
        return $(".soccer-field").width() - (2*$(".endline-area").width()) - (2*$(".goalfront-area").width()) - 12;
    });

    $(window).resize(function() {
        $(".soccer-field").height(function(){
            return $(this).width()*(1530/2048);
        });
        $(".middle-area").width(function(){
            return $(".soccer-field").width() - (2*$(".endline-area").width()) - (2*$(".goalfront-area").width()) - 12;
        });
    });

    $scope.bindPlayers = function(){
        $(".player").draggable();
    };

    $scope.playerClick = function(evt, player, team){
        if($scope.ontargetPick == 1) {
            $scope.playershot = player;
            $scope.playershotteam = team;
            $("#selectMessage").text("Click/Tap the goalkeeper made the save");
            $scope.ontargetPick = 2;
        } else if($scope.ontargetPick == 2) {
            Shot.save({player: $scope.playershot, teamID: $scope.playershotteam, goalkeeper: player, goalieTeamID: team, onGoal: true, id: $scope.event.id});
            $("#selectMessage").text("Saved the shot made");
            $scope.ontargetPick = 0;
        } else if($scope.offtargetPick == 1) {
            Shot.save({player: player, teamID: team, id: $scope.event.id});
            $("#selectMessage").text("Saved the shot made");
            $scope.ontargetPick = 0;
        } else if($scope.goalPick == 1) {
            $scope.playergoal = player;
            $scope.playergoalteam = team;
            $("#selectMessage").text("Click/Tap the player who made the assist");
            $scope.goalPick = 2;
        } else if($scope.goalPick == 2) {
            $scope.playerassist = player;
            $("#selectMessage").text("Click/Tap the goalkeeper who was scored on");
            $scope.goalPick = 3;
        } else if($scope.goalPick == 3) {
            Goal.save({player: $scope.playergoal, teamID: $scope.playergoalteam, assist: $scope.playerassist, goalkeeper: player, goalieTeamID: team, id: $scope.event.id});
            if($scope.playergoalteam == $scope.team1.id) {
                $scope.score1 = $scope.score1 + 1;
                $("#team1-score").text($scope.score1);
            } else {
                $scope.score2 = $scope.score2 + 1;
                $("#team2-score").text($scope.score2);
            }
            $("#selectMessage").text("Saved the goal");
            $scope.ontargetPick = 0;
        } else {
            $scope.currentPlayer = player;
            $scope.currentTeam = team;
            var modaltop = $(evt.currentTarget).offset().top - $("#player-modal").height() - 20;
            var modalleft = $(evt.currentTarget).offset().left - ($("#player-modal").width() / 3) + 20;
            $("#player-modal").css({top: modaltop, left: modalleft, display: 'inherit'});
            evt.stopPropagation();
        }
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

    $scope.hideSelectHeader = function(){
        $("#selectHeader").hide();
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

    $(".soccerball").draggable();

    $(".goal-area").droppable({
        accept: ".soccerball",
        drop: function(event, ui) {
        },
        over: function(event, ui) {
            $(this).css("background-color", "#00ff00");
        },
        out: function(event, ui) {
            $(this).css("background-color", "#00cc00");
        },
        activate: function(event, ui) {
            $(this).css("background-color", "#00cc00");
        },
        deactivate: function(event, ui) {
            $(this).css("background-color", "transparent");
        },
        drop: function(event, ui) {
            $("#selectMessage").text("Click/Tap player who scored the goal");
            $("#selectHeader").show();
            $scope.goalPick = 1;
        }
    });
    $(".offtarget-area").droppable({
        accept: ".soccerball",
        drop: function(event, ui) {
        },
        over: function(event, ui) {
            $(this).css("background-color", "#ff0000");
        },
        out: function(event, ui) {
            $(this).css("background-color", "#cc0000");
        },
        activate: function(event, ui) {
            $(this).css("background-color", "#cc0000");
        },
        deactivate: function(event, ui) {
            $(this).css("background-color", "transparent");
        },
        drop: function(event, ui) {
            $("#selectMessage").text("Click/Tap player who made the shot");
            $("#selectHeader").show();
            $scope.offtargetPick = 1;
        }
    });
    $(".ontarget-area").droppable({
        accept: ".soccerball",
        drop: function(event, ui) {
        },
        over: function(event, ui) {
            $(this).css("background-color", "#ffff00");
        },
        out: function(event, ui) {
            $(this).css("background-color", "#cccc00");
        },
        activate: function(event, ui) {
            $(this).css("background-color", "#cccc00");
        },
        deactivate: function(event, ui) {
            $(this).css("background-color", "transparent");
        },
        drop: function(event, ui) {
            $("#selectMessage").text("Click/Tap player who made the shot");
            $("#selectHeader").show();
            $scope.ontargetPick = 1;
        }
    });

    $(document).click(function() {
        $("#player-modal").css('display', 'none');
    });
});
