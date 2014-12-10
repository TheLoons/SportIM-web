var calendar = angular.module('team',['services']);

calendar.controller('teamc', function($scope, Team) {
    $scope.team = Team.get({id: 1}).team;
});
