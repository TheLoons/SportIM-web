var calendar = angular.module('bracket',['services']);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('bracket', function($scope, League, Events, Event, Tournament, TeamView) {
    $scope.eventData = [];
    $scope.teamIndex = {};
    $scope.twoteamIndex = {};
    $scope.teamData = [];
    $scope.currentIndex = -1;
    $(".selectDate").datepicker()
    $(".selectTime").timepicker({timeFormat: "h:mm TT"});

    $scope.computeLayout = function(){
            setTimeout(function(){$(".teamDrag").draggable();}, 500);
            var half_length = Math.ceil($scope.teamList.length / 2);    
            var leftSide = $scope.teamList.slice(0,half_length);
            var rightSide = $scope.teamList.slice(half_length,$scope.teamList.length);
            var leftSide_length = Math.ceil(leftSide.length / 2);
            var rightSide_length = Math.ceil(rightSide.length / 2);
            var leftSide1 = leftSide.slice(0,leftSide_length);
            var rightSide1 = rightSide.slice(0, rightSide_length);
            $scope.leftSide = leftSide;
            $scope.leftSide1 = leftSide1;
            $scope.rightSide = rightSide;
            $scope.rightSide1 = rightSide1;
            setTimeout(function(){$scope.drop()}, 500);
    };

    TeamView.get().$promise.then(function(resp){
            $scope.teamList = resp.teams;
            $scope.computeLayout();
    });

    League.get().$promise.then(function(resp) {
        $scope.leagueList = resp.leagues;
    });

    $scope.changeLeague = function() {
        League.get({id: $scope.leagueSelected.id}).$promise.then(function(resp){
            $scope.teamList = resp.teams;
            $scope.computeLayout();
        });
    }
     
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
                currentStartDate.add(1, 'd');
                currentEndDate.add(1, 'd');
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
                Events.save($scope.eventData);
            }
        });
    };
    $scope.drop = function(){
        $(".teamDrop").droppable({
            accept: ".teamDrag",
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
                ui.draggable.offset($(this).offset());
                ui.draggable.width($(this).width());
            }
        });
    };

    
});
