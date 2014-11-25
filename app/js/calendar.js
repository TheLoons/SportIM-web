var calendar = angular.module('calendar',['services']);

calendar.controller('files', function($scope, Dir) {
    $scope.files = Dir.files();
});

$(function() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today month,agendaWeek,agendaDay',
            center: '',
            right: 'title'
        },
        defaultDate: '2014-11-12',
        selectable: true,
        selectHelper: true,
        aspectRatio: 1.5,
        select: function(start, end) {
            $('#input-modal').show();
        },
        editable: true,
        eventLimit: true, // allow "more" link when too many events
        eventClick: function(calEvent, jsEvent, view) {
            var modaltop = $(this).offset().top - $("#player-modal").height() - 75;
            var modalleft = $(this).offset().left - ($("#player-modal").width() / 3) - 50;
            $("#game-modal").css({top: modaltop, left: modalleft, display: 'inherit'});
            $("#game-modal-eventname").text(calEvent.title);
            jsEvent.stopPropagation();
        },
        events: [
        {
            title: 'Team 6 v. Team 3',
            start: '2014-11-03T16:00:00',
            end: '2014-11-03T18:00:00'
        },
        {
            title: 'Team 2 v. Team 1',
            start: '2014-11-08T16:00:00',
            end: '2014-11-08T18:00:00'
        },
            {
                title: 'Team 4 v. Team 8',
                start: '2014-11-08T16:00:00',
                end: '2014-11-08T18:00:00'
            },
            {
                title: 'Team 10 v. Team 11',
                start: '2014-11-08T12:00:00',
                end: '2014-11-08T14:00:00'
            },
                {
                    title: 'Team 7 v. Team 5',
                    start: '2014-11-08T18:00:00',
                    end: '2014-11-08T20:00:00'
                },
                {
                    title: 'Team 1 v. Team 3',
                    start: '2014-11-05T16:00:00',
                    end: '2014-11-05T18:00:00',
                    color: '#cc2222'
                },
                    {
                        title: 'Team 2 Practice',
                        start: '2014-11-11T20:00:00',
                        end: '2014-11-11T21:00:00',
                        color: '#22cc22'
                    },
                    ]
    });

    $("#create-tournament").click(function(evt){
        $("#page-cover").show();
        $("#page-cover").css("opacity",0.6);
        $("#tournament-modal").show();
        evt.stopPropagation();
    });

    $(document).click(function() {
        $("#game-modal").css('display', 'none');
        $("#tournament-modal").hide();
        $("#page-cover").hide();
        $('#input-modal').hide();
    });

    $("#game-modal").css('display', 'none');
    $("#tournament-modal").hide();
    $("#page-cover").hide();
    $('#input-modal').hide();

});
