var calendar = angular.module('calendar',['services','ui.calendar']);

calendar.controller('maincalendar', function($scope, Events) {
    $scope.eventSources = [Events.events()];
    $scope.selectDate = function(start, end) {
        $("#page-cover").show();
        $('#input-modal').show();
    };
    $scope.eventClick = function(calEvent, jsEvent, view) {
        var modaltop = $(jsEvent.currentTarget).offset().top - $("#player-modal").height() - 75;
        var modalleft = $(jsEvent.currentTarget).offset().left - ($("#player-modal").width() / 3) - 50;
        $("#game-modal").css({top: modaltop, left: modalleft, display: 'inherit'});
        $("#game-modal-eventname").text(calEvent.title);
        jsEvent.stopPropagation();
    };
    $scope.calendarOptions = {
        header: {
            left: 'prev,next today month,agendaWeek,agendaDay',
            center: '',
            right: 'title'
        },
        selectable: true,
        selectHelper: true,
        aspectRatio: 1.5,
        select: $scope.selectDate,
        editable: true,
        eventLimit: true,
        eventClick: $scope.eventClick
    };
    $scope.refreshCalendar = function() {
        $scope.eventSources = Events.events();
    };
});

$(function() {
    $("#create-tournament").click(function(evt){
        $("#page-cover").show();
        $("#tournament-modal").show();
        evt.stopPropagation();
    });

    $(document).click(function() {
        $("#game-modal").css('display', 'none');
        $("#tournament-modal").hide();
        $("#page-cover").hide();
        $('#input-modal').hide();
    });
});
