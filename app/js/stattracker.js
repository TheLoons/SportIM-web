var calendar = angular.module('stattracker',['services', 'timer', 'ngCookies'])
    .config(['$locationProvider',
        function ($locationProvider) {
            // note we do not require base as we are only using it to parse parameters
            $locationProvider.html5Mode({enabled: true, requireBase: false});
        }
    ]);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('stattrackerc', function($scope, Events, Event, Session, $cookies, $location) {
    if($location.search().event) {
        Event.get({id: $location.search().event}).$promise.then(function(resp) {
            $scope.event = resp.event;
        });
    }

    $scope.startSession = function(){
        Session.get({id: $scope.event.id}).$promise.then(function(resp) {
            $cookies.soccersession = resp.token;
            $scope.$broadcast('timer-start');
        });
    };

    $scope.stopSession = function(){
        $scope.$broadcast('timer-stop');
        console.log($("#timer").text());
    };

    $scope.timerRunning = false;

    $scope.toggleTimer = function() {
        if(!$scope.timerRunning)
            $scope.startSession();
        else
            $scope.stopSession();

        $scope.timerRunning = !$scope.timerRunning;
    };

    $(".player").draggable();
    $(".soccerball").draggable();

    $(".player").click(function(evt) {
        var modaltop = $(this).offset().top - $("#player-modal").height() - 20;
        var modalleft = $(this).offset().left - ($("#player-modal").width() / 3) + 10;
        $("#player-modal").css({top: modaltop, left: modalleft, display: 'inherit'});
        evt.stopPropagation();
    });

    $(document).click(function() {
        $("#player-modal").css('display', 'none');
    });
});
