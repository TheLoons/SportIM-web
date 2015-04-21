
var calendar = angular.module('roundrobin',['services']);

calendar.controller('header', function($scope) {
    loadColors($scope);
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('roundrobinc', function($scope, League, LeagueTables, Events, Event, Tournament, TeamView) {

    $scope.eventData = [];
    $scope.teamIndex = {};
    $scope.twoteamIndex = {};
    $scope.teamData = [];
    $scope.currentIndex = -1;
    $scope.daysbetween = 1;
    $(".selectDate").datepicker()
    $(".selectTime").timepicker({timeFormat: "h:mm TT"});

    TeamView.get().$promise.then(function(resp){
            $scope.teamList = resp.teams;
            angular.forEach($scope.teamList, function(firstTeam, firstTeamKey){
            var start = moment("01/01/2010 13:00:00", "MM/DD/YYYY HH:mm:ss").format(serviceDateFormat);
            var end = moment("01/01/2010 13:00:00", "MM/DD/YYYY HH:mm:ss").format(serviceDateFormat);

            if($scope.teamIndex[firstTeam.name] === undefined)
                $scope.teamIndex[firstTeam.name] = [];

            if($scope.twoteamIndex[firstTeam.name] === undefined)
                $scope.twoteamIndex[firstTeam.name] = {};

            angular.forEach($scope.teamList, function(secondTeam, secondTeamKey){
                if(firstTeam.id != secondTeam.id && firstTeamKey <= secondTeamKey){
                    var index = $scope.eventData.push({"title": firstTeam.name+" v. "+secondTeam.name, "start": start, "end": end, "teamIDs": [firstTeam.id, secondTeam.id], "team1": firstTeam.name, "team2": secondTeam.name, "dateLabel": "Select Date"}) - 1;

                    if($scope.teamIndex[secondTeam.name] === undefined)
                        $scope.teamIndex[secondTeam.name] = [];

                    $scope.teamIndex[firstTeam.name].push(index);
                    $scope.teamIndex[secondTeam.name].push(index);

                    if($scope.twoteamIndex[secondTeam.name] === undefined)
                        $scope.twoteamIndex[secondTeam.name] = {};

                    $scope.twoteamIndex[firstTeam.name][secondTeam.name] = index;
                    $scope.twoteamIndex[secondTeam.name][firstTeam.name] = index;
                }
            });
          });
    });

    League.get().$promise.then(function(resp) {
        $scope.leagueList = resp.leagues;
    });

    $scope.changeTeam = function () {
        $scope.teamData = []
        angular.forEach($scope.teamIndex[$scope.teamSelected.name], function(key){
            $scope.teamData.push($scope.eventData[key]);
        });
    };

    $scope.changeLeague = function() {
        League.get({id: $scope.leagueSelected.id}).$promise.then(function(resp){
            $scope.teamList = resp.league.teams;
        });
    }

    $scope.cancelEvent = function(evt){
        evt.stopPropagation();
        $scope.inputModal = false;
        $scope.clearForm();
    };
    $scope.selectDate = function(evt, evtObject){
        evt.stopPropagation();
        var index = $scope.twoteamIndex[evtObject.team1][evtObject.team2];
        var eventObject = $scope.eventData[index];

        $scope.startDate = eventObject.startDate;
        $scope.endDate = eventObject.endDate;
        $scope.startTime = eventObject.startTime;
        $scope.endTime = eventObject.startTime;
        $scope.eventTitle = eventObject.title;

        $scope.inputModal = true;
        $scope.currentIndex = index;
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
                currentStartDate.add($scope.daysbetween, 'd');
                currentEndDate.add($scope.daysbetween, 'd');
                currentDate = currentStartDate.clone();
            }
            $scope.eventData[key] = eventObject;
        });

        $scope.changeTeam();
    };
    $scope.saveTournament = function(){
        Tournament.save({tournamentName: $scope.tournamentName, desc: $scope.tournamentDesc, leagueId: $scope.leagueSelected.id}).$promise.then(function(resp) {
            if(resp.status.code == 200) {
                angular.forEach($scope.eventData, function(eventObject, key) {
                    eventObject.tournamentID = resp.id;
                    $scope.eventData[key] = eventObject;
                });
                var tournamentId = resp.id;
                Events.save($scope.eventData).$promise.then(function(resp){
                    if ($scope.tableList) {
                        LeagueTables.save({id: $scope.leagueSelected.id, desc: $scope.tournamentDesc, tournamentId: tournamentId}).$promise.then(function(resp) {
                            if(resp.status.code == 200) {
                                document.location = "calendar.html";
                            }
                        });
                    }
                });
            }
        });
    };
});
