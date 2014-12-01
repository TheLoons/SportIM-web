var calendar = angular.module('calendar',['services','ui.calendar']);

calendar.controller('maincalendar', function($scope, Events, Event) {
    $scope.eventSources = [];
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
    $scope.viewChange = function(view, element) {
        var startDate = moment(view.start).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
        var endDate = moment(view.end).format('YYYY-MM-DD[T]HH:mm:ss[Z]');
        Events.events({start: startDate, end: endDate}).$promise.then(function(resp) {
            $scope.eventSources[0] = resp;
          });
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
        editable: true,
        eventLimit: true,
        select: $scope.selectDate,
        eventClick: $scope.eventClick,
        viewRender: $scope.viewChange
    };

    // hack to get full calendar to render on start properly
    setTimeout(function(){
        $('#calendar').fullCalendar('render');
    }, 100);
    $scope.submitEvent = function(){
        var startDate = moment($scope.startDate + " " + $scope.startTime.toTimeString(), "MM/DD/YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');
        var endDate = moment($scope.endDate + " " + $scope.endTime.toTimeString(), "MM/DD/YYYY HH:mm:ss").format('YYYY-MM-DD HH:mm:ss');

        Event.save({start: startDate, end: endDate, title: $scope.eventTitle});
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
    $("#input-modal").click(function(evt){
        evt.stopPropagation();
    });
});

