var home = angular.module('home',['services']);

home.controller('feed', function($scope, Events) {
    var startDate = moment().format(serviceDateFormat);
    var endDate = moment().add(3,'M').format(serviceDateFormat);
    Events.get({start: startDate, end: endDate}).$promise.then(function(resp) {
        var events = resp.events;
        angular.forEach(resp.events, function(value, key){
            events[key].start = moment(value.start).format("MM/DD/YYYY h:mm:ssa");
            events[key].end = moment(value.end).format("MM/DD/YYYY h:mm:ssa");
        }); 
        $scope.events = events;
      });
});
