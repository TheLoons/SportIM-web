var calendar = angular.module('roundrobin',['services']);

calendar.controller('roundrobinc', function($scope, Events, Event) {
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

    $scope.teamData = [];

    $scope.changeTeam = function () {
        $scope.teamData = [];
        angular.forEach($scope.teamList, function(value){
            if(value.id != $scope.teamSelected.id)
                $scope.teamData.push(value);
        });
    };
});
