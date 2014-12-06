var calendar = angular.module('roundrobin',['services']);

calendar.controller('roundrobinc', function($scope, Events, Event) {
    $scope.numGamesSel = [
        {label: "8 Teams", amount: 8},
        {label: "4 Teams", amount: 4}
    ];

    $scope.teamList = [
        {label: "Team 1", id: 1},
        {label: "Team 2", id: 2}
    ];
});
