var calendar = angular.module('stattracker',['services']);

calendar.controller('header', function($scope) {
    $scope.contextItems = [
        //{url: "team.html", label: "My Teams"},
    ];
});

calendar.controller('stattrackerc', function($scope, Events, Event) {
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
