
var calendar = angular.module('calendar',['services','ui.calendar']);

calendar.controller('maincalendar', function($scope, Events, Event) {
    $scope.eventSources = [];
    $scope.selectedEvent = -1;

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
        $scope.gameModal = true;
        var modaltop = $(jsEvent.currentTarget).offset().top - $("#player-modal").height() - 75;
        var modalleft = $(jsEvent.currentTarget).offset().left - ($("#player-modal").width() / 3) - 50;
        $("#game-modal").css({top: modaltop, left: modalleft, display: 'inherit'});
        $("#game-modal-eventname").text(calEvent.title);
        $scope.selectedEvent = calEvent.id;
        jsEvent.stopPropagation();
    };
    $scope.viewChange = function(view, element) {
        var startDate = moment(view.start).format(serviceDateFormat);
        var endDate = moment(view.end).format(serviceDateFormat);
        Events.get({start: startDate, end: endDate}).$promise.then(function(resp) {
            $scope.eventSources[0] = resp;
          });
    };
    $scope.clearForm = function(){
        $scope.endDate = "";
        $scope.startDate = "";
        $scope.endTime = "";
        $scope.startTime = "";
        $scope.eventTitle = "";
        $scope.selectedEvent = -1;
    }
    $scope.deleteEvent = function(evt){
        evt.stopPropagation();
        Event.delete({id: $scope.selectedEvent});
        $scope.gameModal= false;
        setTimeout(function(){
            $('#calendar').fullCalendar('render');
        }, 100);
    };
    $scope.createEvent = function(evt){
        $scope.inputModal = true;
        $scope.clearForm();
        evt.stopPropagation();
    };
    $scope.loadEvent = function(evt){
        evt.stopPropagation();
        Event.get({id: $scope.selectedEvent}).$promise.then(function(resp){
            var evtobj = resp.event;
            $scope.eventTitle = evtobj.title;
            $scope.endDate = moment(evtobj.end).format("MM/DD/YYYY");
            $scope.startDate = moment(evtobj.start).format("MM/DD/YYYY");
            $scope.endTime = moment(evtobj.end).toDate();
            $scope.startTime = moment(evtobj.start).toDate();
            $scope.inputModal = true;
        });
    };
    $scope.cancelEvent = function(evt){
        evt.stopPropagation();
        $scope.inputModal = false;
        $scope.clearForm();
    };
    $scope.submitEvent = function(){
        var startDate = moment($scope.startDate + " " + $scope.startTime.toTimeString(), "MM/DD/YYYY HH:mm:ss").format(serviceDateFormat);
        var endDate = moment($scope.endDate + " " + $scope.endTime.toTimeString(), "MM/DD/YYYY HH:mm:ss").format(serviceDateFormat);
        if ($scope.selectedEvent != -1) {
            Event.update({id: $scope.selectedEvent, start: startDate, end: endDate, title: $scope.eventTitle});
        }
        else{
            Event.save({start: startDate, end: endDate, title: $scope.eventTitle});
        }
        $scope.inputModal = false;
        $scope.gameModal = false;
        setTimeout(function(){
            $('#calendar').fullCalendar('render');
        }, 100);
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

    setTimeout(function(){
        $('#calendar').fullCalendar('render');
    }, 100);
    $("#startdatepicker").datepicker();
    $("#enddatepicker").datepicker();
});
