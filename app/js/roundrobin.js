var calendar = angular.module('roundrobin',['services']);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('roundrobinc', function($scope, Events, Event, Tournament) {
    $(".selectDate").datepicker()

    $scope.teamList = [
        {name: "Team 1", id: 1},
        {name: "Team 2", id: 2},
        {name: "Team 3", id: 3},
        {name: "Team 4", id: 4},
        {name: "Team 5", id: 5},
        {name: "Team 6", id: 6},
        {name: "Team 7", id: 7},
        {name: "Team 8", id: 8}
    ];

    $scope.eventData = [];
    $scope.teamIndex = {};
    $scope.twoteamIndex = {};
    $scope.teamData = [];
    $scope.currentIndex = -1;

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
        var startDate = moment($scope.startDate + " " + $scope.startTime.toTimeString(), "MM/DD/YYYY HH:mm:ss");
        var endDate = moment($scope.endDate + " " + $scope.endTime.toTimeString(), "MM/DD/YYYY HH:mm:ss");
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
        if($scope.totalstartDate == "" || $scope.totalstartTime === undefined || $scope.totalendDate == "" || $scope.totalendTime === undefined)
            return;

        var currentStartDate = moment($scope.totalstartDate + " " + $scope.totalstartTime.toTimeString(), "MM/DD/YYYY HH:mm:ss");
        var currentEndDate = moment($scope.totalstartDate + " " + $scope.totalendTime.toTimeString(), "MM/DD/YYYY HH:mm:ss");
        var endDate = moment($scope.totalendDate + " " + $scope.totalendTime.toTimeString(), "MM/DD/YYYY HH:mm:ss");

        var currentDate = currentStartDate.clone();
        currentEndDate.subtract(1, 'm');

        angular.forEach($scope.eventData, function(eventObject, key) {
            eventObject.startDate = currentDate.format("MM/DD/YYYY");
            eventObject.startTime = currentDate.clone().toDate();
            eventObject.endDate = currentDate.format("MM/DD/YYYY");
            eventObject.start = currentDate.format(serviceDateFormat);

            currentDate.add(2, 'h');
            eventObject.endTime = currentDate.clone().toDate();
            eventObject.end = currentDate.format(serviceDateFormat);
            eventObject.dateLabel = eventObject.startDate + "  " + moment(eventObject.startTime.toTimeString(), "HH:mm:ss").format("h:mm a") + " - " + moment(eventObject.endTime.toTimeString(), "HH:mm:ss").format("h:mm a");

            if(currentDate.isAfter(currentEndDate))
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
        Tournament.save({tournamentName: $scope.tournamentName, desc: $scope.tournamentDesc, leagueId: 1}).$promise.then(function(resp) {
            if(resp.status.code == 200) {
                angular.forEach($scope.eventData, function(eventObject, key) {
                    eventObject.tournamentID = resp.id;
                    $scope.eventData[key] = eventObject;
                });
                Events.save($scope.eventData);
            }
        });
    };
});
