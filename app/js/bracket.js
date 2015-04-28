var calendar = angular.module('bracket',['services']);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html", label: "My Teams"},
        {url: "league.html", label: "My Leagues"}
    ];
});

calendar.controller('bracket', function($scope, $location, League, Events, Event, Tournament, TeamView) {
    $scope.isEdit = true;
    $scope.eventData = [];
    $scope.currentIndex = -1;

    $(".selectDate").datepicker()
    $(".selectTime").timepicker({timeFormat: "h:mm TT"});
    if($location.search().tournament){
        Tournament.get({id: $location.search().tournament}).$promise.then(function(resp) {
            $('#tourn-title').val(resp.tournament.tournamentName).prop('readonly', true);
            $('#tourn-desc').val(resp.tournament.desc).prop('readonly', true);
            $('.league').hide();
            $scope.eventData = resp.tournament.events;

            // determine date labels for events
            angular.forEach($scope.eventData, function(key, index){
                var startDate = moment(key.start);
                var endDate = moment(key.end);
                key.dateLabel = startDate.format("MM/DD/YYYY h:mm a") + " - " + endDate.format("h:mm a");
            });

            $scope.figureoutlayout();
        });
    }
    else
    {
        $scope.isEdit = false;
    }

    $("#ui-datepicker-div, #ui-timepicker-div").click(function(event) {
        event.stopPropagation();
    });

    $scope.figureoutlayout = function(){
        //copy our event data
        var events = $scope.eventData.slice(0);
        $scope.leftOutterMost = [];
        $scope.rightOutterMost = [];
        $scope.final = {teams:[{name:"Final"},{name:"Final"}]};
        $scope.leftSemi = {teams:[{name:"Semi"},{name:"Semi"}]};
        $scope.rightSemi = {teams:[{name:"Semi"},{name:"Semi"}]};

        while(events.length > 0){
            angular.forEach(events, function(key, index){
                if(!key.nextEventID){
                    if(!key.teams || key.teams.length == 0)
                        key.teams = [{name: "Final"},{name: "Final"}];

                    $scope.final = key;
                    events.splice(index, 1);
                }
                else if($scope.final != undefined && key.nextEventID == $scope.final.id){
                    if(!key.teams || key.teams.length == 0)
                        key.teams = [{name: "Semi"},{name: "Semi"}];

                    if(!$scope.leftSemi.id)
                    {
                        $scope.leftSemi = key;
                        events.splice(index, 1);
                    }
                    else
                    {
                        $scope.rightSemi = key;
                        events.splice(index, 1);
                    }
                }
                else if ($scope.leftSemi != undefined && key.nextEventID == $scope.leftSemi.id)
                {
                    if(!key.teams)
                        key.teams = [{name: "Quarter"},{name: "Quarter"}];
                    $scope.leftOutterMost.push(key);
                    events.splice(index, 1);
                }
                else if ($scope.rightSemi != undefined && key.nextEventID == $scope.rightSemi.id)
                {
                    if(!key.teams)
                        key.teams = [{name: "Quarter"},{name: "Quarter"}];
                    $scope.rightOutterMost.push(key);
                    events.splice(index, 1);
                }
            });
        }
    }

    $scope.figureoutlayout();

    $scope.computeLayout = function(){
        if($scope.teamList && $scope.teamList.length > 0)
        {
            var numGames = $scope.teamList.length-1;
            for(var i = 1; i <= numGames; i++)
            {
                if(i < numGames/2)
                {
                    $scope.eventData[i-1] = {teamIDs: [], id: i, nextEventID: Math.ceil(i/2) + Math.ceil(numGames/4), dateLabel: "Select Date" };
                }
                else if(i == Math.ceil(numGames/2))
                {
                    $scope.eventData[i-1] = {teamIDs: [], id: i, dateLabel: "Select Date"};
                }
                else
                {
                    $scope.eventData[i-1] = {teamIDs: [], id: i, nextEventID: Math.floor(i/2) + Math.ceil(numGames/4), dateLabel: "Select Date"};
                }
            }
            $scope.figureoutlayout();
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
                $scope.teamList = $scope.teamList.slice(0,8);
                if($scope.teamList.length == 7)
                    $scope.teamList = $scope.teamList.slice(0,6);
                $scope.computeLayout();
            });
        }
    }

    $scope.validateBeforeSave = function () {
        if(!$scope.tournamentDesc)
        {
            $("#errorHeader").show().find("#errorMessage").text("Must Enter Tournament Description");
            setTimeout(function(){ $("#errorHeader").hide(); }, 4000);
            return false;
        }
        if(!$scope.tournamentName)
        {
            $("#errorHeader").show().find("#errorMessage").text("Must Enter A Tournament Name");
            setTimeout(function(){ $("#errorHeader").hide(); }, 4000);
            return false;
        }
        if(!$scope.leagueSelected)
        {
            $("#errorHeader").show().find("#errorMessage").text("Must Select A League");
            setTimeout(function(){ $("#errorHeader").hide(); }, 4000);
            return false;
        }
        for(var i = 0; i < $scope.eventData.length; i++) {
            var eventObject = $scope.eventData[i];
            if(!eventObject.start || !eventObject.end)
            {
                $("#errorHeader").show().find("#errorMessage").text("Must Enter Start And End Date/Time For Each Game");
                setTimeout(function(){ $("#errorHeader").hide(); }, 4000);
                return false;
            }
            if(!eventObject.title)
            {
                $("#errorHeader").show().find("#errorMessage").text("Must Enter A Title For Each Game");
                setTimeout(function(){ $("#errorHeader").hide(); }, 4000);
                return false;
            }
        }
        return true;
    };

    $scope.cancelEvent = function(evt){
        evt.stopPropagation();
        $scope.inputModal = false;
        $scope.clearForm();
    };
    $scope.selectDate = function(evt, evtObject){
        evt.stopPropagation();
        var eventObject = $scope.eventData[evtObject-1];

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
        var eventIndex = $scope.currentIndex-1;

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
        $scope.figureoutlayout();
    };
    $scope.updateEvents = function(teamID, eventID){
        if($scope.eventData[eventID-1] != undefined)
        {
            $scope.eventData[eventID-1].teamIDs.push(teamID);
        }
        else
        {
            $scope.eventData[eventID-1] = {teamIDs: [teamID]};
        }
    };
    $scope.removeTeam = function(teamID, eventID){
        $scope.eventData[eventID-1].teamIDs.splice($scope.eventData[eventID-1].teamIDs.indexOf(teamID),1);
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
                $("#successHeader").show().find("#successMessage").text("Saved Bracket");
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
