var calendar = angular.module('stattracker',['services', 'timer', 'ngCookies']);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html", label: "My Teams"},
        {url: "league.html", label: "My Leagues"}
    ];
});

calendar.controller('stattrackerc', function($scope, Team, Event, Session, SessionReset, Foul, Shot, Goal, Pass, TimeStart, HalfEnd, HalfStart, TimeEnd, Finalize, UltimateFoul, UltimatePoint, $cookies, $location) {
    $scope.score1 = 0;
    $scope.score2 = 0;
    $scope.passingMode = false;
    $scope.passingStep = 1;
    $scope.timeStep = 1;
    $scope.periodlabel = "";

    $(".soccer-field").height(function(){
        return $(this).width()*(1530/2048);
    });

    $(".middle-area").width(function(){
        return $(".soccer-field").width() - (2*$(".endline-area").width()) - (2*$(".goalfront-area").width()) - 13;
    });

    $(window).resize(function() {
        $(".soccer-field").height(function(){
            return $(this).width()*(1530/2048);
        });
        $(".middle-area").width(function(){
            return $(".soccer-field").width() - (2*$(".endline-area").width()) - (2*$(".goalfront-area").width()) - 13;
        });
    });

    $scope.bindPlayers = function(){
        $(".player").draggable({
            start: function(e, ui) {
                $(this).data("dragstart", true);
                $("#player-modal").css('display', 'none');
            }
        });
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
            if($scope.isSoccer)
                $("#selectMessage").text("Click/Tap the player who made the assist");
            else
                $("#selectMessage").text("Click/Tap the thrower");

            if($scope.isSoccer)
                $scope.goalPick = 2;
            else
                $scope.goalPick = 3;
        } else if($scope.goalPick == 2) {
            $scope.playerassist = player;
            $("#selectMessage").text("Click/Tap the goalkeeper who was scored on");
            $scope.goalPick = 3;
        } else if($scope.goalPick == 3) {
            if($scope.isSoccer)
                Goal.save({player: $scope.playergoal, teamID: $scope.playergoalteam, assist: $scope.playerassist, goalkeeper: player, goalieTeamID: team, id: $scope.event.id});
            else
                UltimatePoint.save({receiver: $scope.playergoal, teamID: $scope.playergoalteam, thrower: player, opposingTeamID: team, id: $scope.event.id});
            if($scope.playergoalteam == $scope.team1.id) {
                $scope.score1 = $scope.score1 + 1;
                $("#team1-score").text($scope.score1);
            } else {
                $scope.score2 = $scope.score2 + 1;
                $("#team2-score").text($scope.score2);
            }
            if($scope.isSoccer)
                $("#selectMessage").text("Saved the goal");
            else
                $("#selectMessage").text("Saved the point");
            $scope.ontargetPick = 0;
        } else if($scope.passingMode && $scope.passingStep == 1) {
            $scope.passingPlayer = player;
            $scope.passingStep = 2;
            $("#selectMessage").text("Select player passing to");
            $scope.showSelectHeader();
        } else if($scope.passingMode && $scope.passingStep == 2) {
            Pass.save({to: player, from: $scope.passingPlayer, id: $scope.event.id});
            $scope.passingStep = 1;
            $("#selectMessage").text("Saved the Pass");
            $scope.showSelectHeader();
        } else if($(evt.currentTarget).data("dragstart") == true) {
            $(evt.currentTarget).data("dragstart", false);
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
            $scope.isSoccer = ($scope.event.sport == "SOCCER");
            if($scope.isSoccer) {
                $(".soccer-field").css("background-image", "url('../images/soccerfield.png')");
                $(".soccerball").attr("src", "../images/soccerball.png");

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
                        $scope.showSelectHeader();
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
                        $scope.showSelectHeader();
                        $scope.ontargetPick = 1;
                    }
                });
            }
            else  {
                $(".soccer-field").css("background-image", "url('../images/ultimatefield.png')");
                $(".soccerball").attr("src", "../images/frisbee.png");
            }

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

    $scope.hideResetHeader = function(){
        $("#resetHeader").hide();
    };

    $scope.hideSelectHeader = function(){
        $("#selectHeader").css("background-color", "#fff");
    };

    $scope.showSelectHeader = function(){
        $("#selectHeader").css("background-color", "#777");
    };

    $scope.startFirstHalf = function(){
        $scope.$broadcast('timer-start');
        var currTime = moment().format(serviceDateFormat);

        var players1 = [];
        for(var i = 0; i < $scope.team1.players.length; i++)
            players1.push($scope.team1.players[i].login);

        var players2 = [];
        for(var i = 0; i < $scope.team2.players.length; i++)
            players2.push($scope.team2.players[i].login);

        TimeStart.save({id: $scope.event.id, teamID: $scope.team1.id, teamID2: $scope.team2.id,
            timestamp: currTime, starters: players1, starters2: players2}).$promise.then(function(resp) {
            $scope.timeStep = 2;
            $scope.periodlabel = "1H";
        });
    };

    $scope.endFirstHalf = function(){
        $scope.$broadcast('timer-stop');
        var currTime = moment().format(serviceDateFormat);

        HalfEnd.save({id: $scope.event.id, timestamp: currTime}).$promise.then(function(resp) {
            $scope.timeStep = 3;
            $scope.periodlabel = "Half";
        });
    };

    $scope.startSecondHalf = function(){
        $scope.$broadcast('timer-resume');
        var currTime = moment().format(serviceDateFormat);

        HalfStart.save({id: $scope.event.id, timestamp: currTime}).$promise.then(function(resp) {
            $scope.timeStep = 4;
            $scope.periodlabel = "2H";
        });
    };

    $scope.endSecondHalf = function(){
        $scope.$broadcast('timer-stop');
        var currTime = moment().format(serviceDateFormat);

        if($scope.isSoccer) {
            TimeEnd.save({id: $scope.event.id, timestamp: currTime}).$promise.then(function(resp) {
                $scope.timeStep = 1;
                $cookies.soccersession = "";
                $scope.periodlabel = "End";
            });
        } else {
            Finalize.save({id: $scope.event.id}).$promise.then(function(resp) {
                $scope.timeStep = 1;
                $cookies.soccersession = "";
                $scope.periodlabel = "End";
            });
        }
    };

    $scope.startSession = function(){
        Session.get({id: $scope.event.id}).$promise.then(function(resp) {
            //check for session conflict
            if(resp.status.code == 409) {
                $("#errorHeader").hide();
                $("#resetHeader").show();
            } else {
                $cookies.soccersession = resp.session;
                if($scope.isSoccer) {
                    $scope.startFirstHalf();
                } else {
                    $scope.timeStep = 4;
                    $scope.$broadcast('timer-start');
                }
            }
        });
    };

    $scope.resetSession = function(){
        $("#resetHeader").hide();
        SessionReset.get({id: $scope.event.id}).$promise.then(function(resp) {
            $cookies.soccersession = resp.session;
            if($scope.isSoccer) {
                $scope.startFirstHalf();
            } else {
                $scope.timeStep = 4;
                $scope.$broadcast('timer-start');
            }
        });
    };

    $scope.timerRunning = false;

    $scope.toggleTimer = function() {
        if(!$scope.timerRunning)
        {
            if($scope.timeStep == 1)
                $scope.startSession();
            else if ($scope.timeStep == 3)
                $scope.startSecondHalf();
        }
        else
        {
            if($scope.timeStep == 2)
                $scope.endFirstHalf();
            else if ($scope.timeStep == 4)
                $scope.endSecondHalf();
        }

        $scope.timerRunning = !$scope.timerRunning;
    };

    $scope.foul = function(type){
        if(type == 'red') {
            var parameters = {id: $scope.event.id, player: $scope.currentPlayer, teamID: $scope.currentTeam, red: 'true'};
            var message = "Red Card";
        }
        else if(type == 'yellow') {
            var parameters = {id: $scope.event.id, player: $scope.currentPlayer, teamID: $scope.currentTeam, yellow: 'true'};
            var message = "Yellow Card";
        }
        else {
            var parameters = {id: $scope.event.id, player: $scope.currentPlayer, teamID: $scope.currentTeam};
            var message = "Foul";
        }
        var endpoint = Foul;
        if(!$scope.isSoccer)
            endpoint = UltimateFoul;

        endpoint.save(parameters).$promise.then(function(resp) {
            if(resp.status.code == 200) {
                setTimeout(function(){$(".player").draggable();}, 500);
                $("#selectMessage").text("Saved "+message);
                $scope.showSelectHeader();
            }
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
            if($scope.isSoccer)
                $("#selectMessage").text("Click/Tap player who scored");
            else
                $("#selectMessage").text("Click/Tap the reciever");
            $scope.showSelectHeader();
            $scope.goalPick = 1;
        }
    });

    $(document).click(function() {
        $("#player-modal").css('display', 'none');
    });

    $scope.enablePassing = function(){
        $scope.passingMode = true;
        $(".player").draggable("destroy");
        $(".soccerball").draggable("destroy");
    };

    $scope.disablePassing = function(){
        $scope.passingMode = false;
        $scope.bindPlayers();
        $(".soccerball").draggable();
    };
});
