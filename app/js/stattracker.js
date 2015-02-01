var calendar = angular.module('stattracker',['services', 'timer'])
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

calendar.controller('stattrackerc', function($scope, Events, Event, $location) {
    if($location.search().event) {
        Event.get({id: $location.search().event}).$promise.then(function(resp) {
            $scope.event = resp.event;
        });
    }

    $scope.timerRunning = false;
    $scope.timerStarted = false;
    $scope.time = "";

    $scope.toggleTimer = function() {
        if(!$scope.timerRunning && !$scope.timerStarted)
            $scope.$broadcast('timer-start');
        else if(!$scope.timerRunning)
            $scope.$broadcast('timer-resume');
        else
            $scope.$broadcast('timer-stop');
        $scope.timerStarted = true;
        $scope.timerRunning = !$scope.timerRunning;
        console.log($("#timer").text());
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
