var calendar = angular.module('roundrobin',['services']);

calendar.controller('roundrobinc', function($scope, Events, Event) {
    $scope.teamList = [
        {name: "Team 1", id: 1},
        {name: "Team 2", id: 2},
        {name: "Team 3", id: 2},
        {name: "Team 4", id: 2},
        {name: "Team 5", id: 2},
        {name: "Team 6", id: 2},
        {name: "Team 7", id: 2},
        {name: "Team 8", id: 2}
    ];

    $scope.teamData = [];

    $scope.changeTeam = function () {
        $scope.teamDate = [];
        angular.forEach($scope.teamList, function(value,key){
            if(key.id != $scope.teamSelected.id)
                $scope.teamDate.push(key);
        });
    };
});
