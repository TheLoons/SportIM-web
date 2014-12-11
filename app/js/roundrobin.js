var calendar = angular.module('roundrobin',['services']);

calendar.controller('roundrobinc', function($scope, Events, Event) {
    $scope.teamList = [
        {name: "Team1", id: 1},
        {name: "Team2", id: 2},
        {name: "Team3", id: 3},
        {name: "Team4", id: 4},
        {name: "Team5", id: 5},
        {name: "Team6", id: 6},
        {name: "Team7", id: 7},
        {name: "Team8", id: 8}
    ];

    $scope.eventData = [];
    $scope.teamData = [];
    $scope.button = "Select Date";
    $scope.index = -1;
    angular.forEach($scope.teamList, function(firstTeam){
        $scope.eventData[firstTeam.name] = [];
        angular.forEach($scope.teamList, function(secondTeam){
            if(firstTeam.id != secondTeam.id){
                $scope.eventData[firstTeam.name].push({"teamIDs": [firstTeam.id, secondTeam.id], "opponent": secondTeam.name});
            }
        });
    });
     
    $scope.changeTeam = function () {
        $scope.teamData = $scope.eventData[$scope.teamSelected.name];
    };
    $("#startdatepicker").datepicker();
    $("#enddatepicker").datepicker();

    $scope.cancelEvent = function(evt){
        evt.stopPropagation();
        $scope.inputModal = false;
        $scope.button = "boo";
    };
    $scope.selectDate = function(evt, index){
        debugger
        evt.stopPropagation();
        $scope.index = index;
        $scope.inputModal = true;
        $scope.eventData[$scope.teamSelected.name][index];
        
    };
    $scope.submitEvent = function(){

        $scope.eventData[$scope.teamSelected.name][$scope.index].eventTitle = $scope.eventTitle;
        $scope.eventData[$scope.teamSelected.name][$scope.index].startDate = $scope.startDate;
        $scope.eventData[$scope.teamSelected.name][$scope.index].endDate = $scope.endDate;
        $scope.eventData[$scope.teamSelected.name][$scope.index].startTime = $scope.startTime;
        $scope.eventData[$scope.teamSelected.name][$scope.index].endTime = $scope.endTime;
        $scope.inputModal = false;
    };
});
