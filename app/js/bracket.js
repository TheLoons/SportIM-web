var calendar = angular.module('bracket',['services']);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('bracket', function($scope, $location, League, Events, Event, Tournament, TeamView) {
    $scope.isEdit = true;
    $scope.eventData = [];
    $scope.teamIndex = {};
    $scope.twoteamIndex = {};
    $scope.teamData = [];
    $scope.halfTeamLength = 0;
    $scope.currentIndex = -1;
    $(".selectDate").datepicker()
    $(".selectTime").timepicker({timeFormat: "h:mm TT"});
    $scope.final = {teams:[{name:"Final"},{name:"Final"}]};
    $scope.leftSemi = {teams:[{name:"Semi"},{name:"Semi"}]};
    $scope.rightSemi = {teams:[{name:"Semi"},{name:"Semi"}]};
    $scope.leftOutterMost = [];
    $scope.rightOutterMost = [];
    if($location.search().tournament){
        Tournament.get({id: $location.search().tournament}).$promise.then(function(resp) {
            // SET TITLE MAKE UN EDITABLE
            debugger
            $scope.eventData = resp.tournament.events;
            var count = 0;
            while(count < resp.tournament.events.length){
                angular.forEach(resp.tournament.events, function(key){
                    if(!key.nextEventID){
                        $scope.final = key;
                        count++;
                    }
                    else if($scope.final != undefined && key.nextEventID == $scope.final.id){
                            if(!$scope.leftSemi.id)
                            {
                                $scope.leftSemi = key;
                                count++;
                            }
                            else
                            {
                                $scope.rightSemi = key;
                                count++;
                            }
                    }
                    else if ($scope.leftSemi != undefined && key.nextEventID == $scope.leftSemi.id)
                    {

                        $scope.leftOutterMost.push(key);
                        count++;
                    }
                    else if ($scope.rightSemi != undefined && key.nextEventID == $scope.rightSemi.id)
                    {
                        $scope.rightOutterMost.push(key);
                        count++;

                    }

                });
            }
        });
    }
    else
    {
        $scope.isEdit = false;
    }

    $("#ui-datepicker-div, #ui-timepicker-div").click(function(event) {
        event.stopPropagation();
    });

    $scope.computeLayout = function(){
        if($scope.teamList && $scope.teamList.length > 0)
        {
            var numGames = $scope.teamList.length-1;
            for(var i = 1; i <= numGames; i++)
            {
                if(i < numGames/2)
                {
                    $scope.eventData[i-1] = {teamIDs: [], id: i, nextEventID: Math.ceil(i/2) + Math.ceil(numGames/4), teams: [{name: "Quarter"},{name: "Quarter"}] };

                }
                else if(i == Math.ceil(numGames/2))
                {
                    $scope.eventData[i-1] = {teamIDs: [], id: i};
                }
                else
                {
                    $scope.eventData[i-1] = {teamIDs: [], id: i, nextEventID: Math.floor(i/2) + Math.ceil(numGames/4),  teams: [{name: "Quarter"},{name: "Quarter"}] };
                }
            }
            $scope.halfTeamLength = Math.ceil($scope.teamList.length / 2);
            var half_length = Math.ceil($scope.teamList.length / 2);
            var secondDivide = half_length/2;
            var leftOutterMost = $scope.eventData.slice(0,secondDivide);
            var rightOutterMost = $scope.eventData.slice($scope.teamList.length - secondDivide-1, $scope.teamList.length-1);
            var outterMostLength = Math.ceil(rightOutterMost.length / 2);
            var innerMost = rightOutterMost.slice(0,outterMostLength);
            $scope.rightOutterMost = rightOutterMost;
            $scope.leftOutterMost = leftOutterMost;
            $scope.innerMost = innerMost;
            $('#noTeams').hide();
            setTimeout(function(){$scope.drop()}, 500);
        }
        else
        {
            $('#noTeams').show();
        }
        setTimeout(function(){$(".teamDrag").draggable({revert: "invalid"});}, 500);
    };

    League.get().$promise.then(function(resp) {
        $scope.leagueList = resp.leagues;
    });

    $scope.changeLeague = function() {
        if(!$scope.isEdit){
            League.get({id: $scope.leagueSelected.id}).$promise.then(function(resp){
                $scope.teamList = resp.league.teams;
                $scope.computeLayout();
            });
        }

    }

    $scope.validateBeforeSave = function () {
        if(!$scope.tournamentDesc)
        {
            console.log("error message for tournament description");
            return false;
        }
        if(!$scope.tournamentName)
        {
            console.log("error message for tournament name");
            return false;
        }
        if(!$scope.leagueSelected)
        {
            console.log("error message for tournament leagueSelected");
            return false;
        }
        return true;

    };
    $scope.changeTeam = function () {
        $scope.teamData = []
        angular.forEach($scope.teamIndex[$scope.teamSelected.name], function(key){
            $scope.teamData.push($scope.eventData[key]);
        });
    };

    $scope.cancelEvent = function(evt){
        evt.stopPropagation();
        $scope.inputModal = false;
        $scope.clearForm();
    };
    $scope.selectDate = function(evt, evtObject){
        evt.stopPropagation();
        var eventObject = $scope.eventData[evtObject];

        $scope.startDate = eventObject.startDate;
        $scope.endDate = eventObject.endDate;
        $scope.startTime = eventObject.startTime;
        $scope.endTime = eventObject.startTime;
        $scope.eventTitle = eventObject.title;

        $scope.inputModal = true;
        $scope.currentIndex = evtObject;
    };
    $scope.clearForm = function(){
        $scope.endDate = "";
        $scope.startDate = "";
        $scope.endTime = "";
        $scope.startTime = "";
        $scope.eventTitle = "";
    };
    $scope.submitEvent = function(){
        var startDate = moment($scope.startDate + " " + $scope.startTime, "MM/DD/YYYY h:mm A");
        var endDate = moment($scope.endDate + " " + $scope.endTime, "MM/DD/YYYY h:mm A");
        var eventIndex = $scope.currentIndex;

        $scope.eventData[eventIndex].title = $scope.eventTitle;
        $scope.eventData[eventIndex].startDate = $scope.startDate;
        $scope.eventData[eventIndex].endDate = $scope.endDate;
        $scope.eventData[eventIndex].startTime = $scope.startTime;
        $scope.eventData[eventIndex].endTime = $scope.endTime;
        $scope.eventData[eventIndex].start = startDate.format(serviceDateFormat);
        $scope.eventData[eventIndex].end = endDate.format(serviceDateFormat);
        $scope.eventData[eventIndex].dateLabel = $scope.startDate + "  " + startDate.format("h:mm a") + " - " + endDate.format("h:mm a");

        $scope.inputModal = false;
        $scope.clearForm();
    };
    $scope.updateEvents = function(teamID, eventID){
        if($scope.eventData[eventID] != undefined)
        {
            $scope.eventData[eventID].teamIDs.push(teamID);
        }
        else
        {
            $scope.eventData[eventID] = {teamIDs: [teamID]};
        }
    };
    $scope.removeTeam = function(teamID, eventID){
        $scope.eventData[eventID].teamIDs.splice($scope.eventData[eventID].teamIDs.indexOf(teamID),1);
    };
    $scope.updateDefaultDates = function(){
        if($scope.totalstartDate == "" || $scope.totalstartTime == "" || $scope.totalendDate == "" || $scope.totalendTime == "")
            return;

        var currentStartDate = moment($scope.totalstartDate + " " + $scope.totalstartTime, "MM/DD/YYYY h:mm A");
        var currentEndDate = moment($scope.totalstartDate + " " + $scope.totalendTime, "MM/DD/YYYY h:mm A");
        var endDate = moment($scope.totalendDate + " " + $scope.totalendTime, "MM/DD/YYYY h:mm A");

        var currentDate = currentStartDate.clone();

        angular.forEach($scope.eventData, function(eventObject, key) {
            eventObject.startDate = currentDate.format("MM/DD/YYYY");
            eventObject.startTime = currentDate.format("h:mm A");
            eventObject.endDate = currentDate.format("MM/DD/YYYY");
            eventObject.start = currentDate.format(serviceDateFormat);

            currentDate.add(2, 'h');
            eventObject.endTime = currentDate.format("h:mm A");
            eventObject.end = currentDate.format(serviceDateFormat);
            eventObject.dateLabel = eventObject.startDate + "  " + eventObject.startTime + " - " + eventObject.endTime;

            if(currentDate.clone().add(2, 'h').isAfter(currentEndDate))
            {
                currentStartDate.add(1, 'd');
                currentEndDate.add(1, 'd');
                currentDate = currentStartDate.clone();
            }
            $scope.eventData[key] = eventObject;
        });

        $scope.changeTeam();
    };
    $scope.saveTournament = function(){
        if(!$scope.validateBeforeSave())
        {
            return;
        }
        $scope.eventData = $scope.eventData.filter(function(n){ return n != undefined });
        Tournament.save({tournamentName: $scope.tournamentName, desc: $scope.tournamentDesc, leagueId: $scope.leagueSelected.id}).$promise.then(function(resp) {
            if(resp.status.code == 200) {
                angular.forEach($scope.eventData, function(eventObject, key) {
                    eventObject.tournamentID = resp.id;
                    $scope.eventData[key] = eventObject;
                });
                Events.save($scope.eventData);
            }
        });
    };
    $scope.drop = function(){
        $(".teamDrop").droppable({
            accept: ".teamDrag",
            over: function(event, ui) {
                $(this).css("background-color", "#ffff00");
            },
            out: function(event, ui) {
                $(this).css("background-color", "#cccc00");
                $(this).droppable("enable");
            },
            activate: function(event, ui) {
                $(this).css("background-color", "#cccc00");
            },
            deactivate: function(event, ui) {
                $(this).css("background-color", "transparent");
            },
            drop: function(event, ui) {
                ui.draggable.offset($(this).offset());
                ui.draggable.width($(this).width());
                ui.draggable.data("eventid", $(this).parent().data("eventid"));
                ui.draggable.data("slot", $(this));
                ui.draggable.switchClass("teamDrag", "teamDragDropped");
                $(".teamDrop").css("background-color", "transparent");
                $scope.updateEvents(ui.draggable.data("teamid"), $(this).parent().data("eventid"));
                $(this).droppable("disable");
            }
        });
        $("#teamList").droppable({
            accept: ".teamDragDropped",
            over: function(event, ui) {
                $(this).css("background-color", "#ffff00");
            },
            out: function(event, ui) {
                $(this).css("background-color", "#cccc00");
                $(this).droppable("enable");
            },
            activate: function(event, ui) {
                $(this).css("background-color", "#cccc00");
            },
            deactivate: function(event, ui) {
                $(this).css("background-color", "transparent");
            },
            drop: function(event, ui) {
                $scope.removeTeam(ui.draggable.data("teamid"), ui.draggable.data("eventid"));
                $(ui.draggable.data("slot")).droppable("enable");
                $(".teamDrop").css("background-color", "transparent");
                $(this).css("background-color", "transparent");
                ui.draggable.switchClass("teamDragDropped", "teamDrag");
            }
        });
    };
});
