var home = angular.module('home',['services']);

home.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html", label: "My Teams"},
        {url: "league.html", label: "My Leagues"}
    ];
});

home.controller('feed', function($scope, Events) {
    var startDate = moment().format(serviceDateFormat);
    var endDate = moment().add(3,'M').format(serviceDateFormat);
    Events.get({start: startDate, end: endDate}).$promise.then(function(resp) {
        var events = resp.events.slice(0,10);
        angular.forEach(events, function(value, key){
            events[key].startday = moment(value.start).format("D");
            events[key].startmonth = moment(value.start).format("MMM");
            events[key].start = moment(value.start).format("h:mm A");
            events[key].end = moment(value.end).format("h:mm A");
        }); 
        if(events.length == 0)
            $scope.noevents = "No Upcoming Events";
        else
            $scope.events = events;
    });
});
