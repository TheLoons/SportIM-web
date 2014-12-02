var calendar = angular.module('calendar',['services','ui.calendar']);

calendar.controller('maincalendar', function($scope, Events, Event) {
    $scope.eventSources = [];
    $scope.seletedEvent = -1;

    $scope.selectDate = function(start, end) {
        $scope.inputModal = true;
        var startDate = (start.getMonth() + 1) + "/" + start.getDate() + "/" + start.getFullYear();
        var endDate = (end.getMonth() + 1) + "/" + end.getDate() + "/" + end.getFullYear();
        $scope.startDate = startDate;
        $scope.endDate = endDate;
        $scope.startTime = start;
        $scope.endTime = end;
    };
    $scope.eventClick = function(calEvent, jsEvent, view) {
        var modaltop = $(jsEvent.currentTarget).offset().top - $("#player-modal").height() - 75;
        var modalleft = $(jsEvent.currentTarget).offset().left - ($("#player-modal").width() / 3) - 50;
        $("#game-modal").css({top: modaltop, left: modalleft, display: 'inherit'});
        $("#game-modal-eventname").text(calEvent.title);
        jsEvent.stopPropagation();
    };
    $scope.viewChange = function(view, element) {
        var startDate = moment(view.start).format(serviceDateFormat);
        var endDate = moment(view.end).format(serviceDateFormat);
        Events.get({start: startDate, end: endDate}).$promise.then(function(resp) {
            $scope.eventSources[0] = resp;
          });
    };
    $scope.createEvent = function(evt){
        $scope.inputModal = true;
        $scope.endDate = "";
        $scope.startDate = "";
        evt.stopPropagation();
    };
    $scope.cancelEvent = function(evt){
        $scope.inputModal = false;
        $scope.endDate = "";
        $scope.startDate = "";
        evt.stopPropagation();
    };
    $scope.submitEvent = function(){
        var startDate = moment($scope.startDate + " " + $scope.startTime.toTimeString(), "MM/DD/YYYY HH:mm:ss").format(serviceDateFormat);
        var endDate = moment($scope.endDate + " " + $scope.endTime.toTimeString(), "MM/DD/YYYY HH:mm:ss").format(serviceDateFormat);
        Event.save({start: startDate, end: endDate, title: $scope.eventTitle});
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
});
