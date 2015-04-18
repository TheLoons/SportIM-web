var home = angular.module('home',['services']);

home.controller('header', function($scope) {
    $scope.contextItems = [
        {url: "player.html#/players", label: "My Players"},
        {url: "team.html", label: "My Teams"},
        {url: "league.html", label: "My Leagues"}
    ];
});
home.controller('color', function($scope) {

});
home.controller('feed', function($scope, Events, League, LeagueTables, Color, TeamView, LeagueTableResult, TeamView) {
    TeamView.get().$promise.then(function(resp){
        $scope.teamList = resp.teams;
    });
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

    $scope.loadTournament = function(leagueId, tableId) {
        TeamView.get().$promise.then(function(resp) {
            if(resp.status.code == 200) {
                var teamviews = resp.teams
                LeagueTableResult.get({id: leagueId, tableID: tableId}).$promise.then(function(resp){
                    var table = resp.tournamentResults;

                    angular.forEach(table, function(teamResults, key){
                        angular.forEach(teamviews, function(team, key){
                            if(teamResults.teamID == team.id)
                                teamResults.name = team.name;
                        });
                    });

                    $scope.tournamentResults = table;
                });
            }
        });
    }
    $scope.saveColors = function(){
        debugger
        var primaryColor = $('#primary').val();
        var secondaryColor = $('#secondary').val();
        var tertiaryColor = $('#tertiary').val();

        Color.save({id: $scope.teamSelected.id, primaryColor: primaryColor, secondaryColor: secondaryColor, tertiaryColor: tertiaryColor});
        
    };


    // Get first league and league table we find, and display it.
    League.get().$promise.then(function(resp) {
        if(resp.leagues.length != 0) {
            var leagueid = resp.leagues[0].id;
            LeagueTables.get({id: leagueid}).$promise.then(function(resp){
                if(resp.tables.length != 0) {
                    $scope.loadTournament(leagueid, resp.tables[0].tournamentId);
                }
            });
        }
    });
});
