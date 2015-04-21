    var calendar = angular.module('calendar',['services','ui.calendar']);

    calendar.controller('header', function($scope) {
        $scope.contextItems = [
                {url: "player.html#/players", label: "My Players"},
                {url: "team.html", label: "My Teams"},
                {url: "league.html", label: "My Leagues"}
            ];
        });

    calendar.controller('maincalendar', function($scope, Events, Event, TeamView) {
        $scope.eventSources = [];
        $scope.selectedEvent = -1;

        $scope.selectDate = function(start, end) {
            $scope.inputModal = true;
            var startDate = (start.getMonth() + 1) + "/" + start.getDate() + "/" + start.getFullYear();
            var endDate = (end.getMonth() + 1) + "/" + end.getDate() + "/" + end.getFullYear();
            $scope.startDate = startDate;
            $scope.endDate = endDate;
            $scope.startTime = moment(start).format("h:mm A");
            $scope.endTime = moment(end).format("h:mm A");
        };
        $scope.eventClick = function(calEvent, jsEvent, view) {
            $scope.gameModal = true;
            $('.button-moreOptions').show();
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
                for(var i = 0; i < resp.events.length; i++)
                {
                    if (resp.events[i].tournamentID) {
                        resp.events[i].color = "#FF4444";
                    }
                    else{
                        resp.events[i].color = "#4444FF";
                    }
                }
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
            $scope.team1 = "";
            $scope.team2 = "";
            $('.button-moreOptions').hide();
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
                $scope.endTime = moment(evtobj.end).format("h:mm A");
                $scope.startTime = moment(evtobj.start).format("h:mm A");
                $('#eventType').val(resp.event.type);
                if (evtobj.teams && evtobj.teams[0]) {
                    $scope.team1 = evtobj.teams[0].id;
                    $("#team1").val(evtobj.teams[0].name);
                    teamAutocomplete("#team1", TeamView);
                }
                if (evtobj.teams && evtobj.teams[1]) {
                    $scope.team2 = evtobj.teams[1].id;
                    $("#team2").val(evtobj.teams[1].name);
                    teamAutocomplete("#team2", TeamView);
                }
                $scope.inputModal = true;
            });
        };
        $scope.cancelEvent = function(evt){
            evt.stopPropagation();
            $scope.inputModal = false;
            $scope.clearForm();
        };
        $scope.submitEvent = function(){
            var startDate = moment($scope.startDate + " " + $scope.startTime, "MM/DD/YYYY h:mm A").format(serviceDateFormat);
            var endDate = moment($scope.endDate + " " + $scope.endTime, "MM/DD/YYYY h:mm A").format(serviceDateFormat);
            if (!$scope.team1 || !$scope.team2) {
                return;
            }
            else{
                if($scope.team1.substring)
                    $scope.team1 = parseInt($scope.team1);
                if($scope.team2.substring)
                    $scope.team2 = parseInt($scope.team2);

                if ($scope.selectedEvent != -1) {
                    Event.update({id: $scope.selectedEvent, start: startDate, end: endDate, title: $scope.eventTitle, type: $('#eventType').val(),  teamIDs: [$scope.team1, $scope.team2]});
                }
                else{
                    Event.save({start: startDate, end: endDate, title: $scope.eventTitle, type: $('#eventType').val(),  teamIDs: [$scope.team1, $scope.team2]});
                }
            }
            $('#eventType').val("");
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
        $("#startTime").timepicker({timeFormat: "h:mm TT"});
        $("#endTime").timepicker({timeFormat: "h:mm TT"});
        $("#ui-datepicker-div").click( function(event) {
            event.stopPropagation();
        });
    });
