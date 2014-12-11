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
    angular.forEach($scope.teamList, function(firstTeam){
        $scope.eventData[firstTeam.name] = [];
        angular.forEach($scope.teamList, function(secondTeam){
            if(firstTeam.id != secondTeam.id){
                $scope.eventData[firstTeam.name].push({"teamIDs": [firstTeam.id, secondTeam.id]});
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
        $scope.clearForm();
    };
    $scope.selectDate = function(evt, team1, team2){
        
        
    };
});
